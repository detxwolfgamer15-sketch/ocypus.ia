'use client';

import React, { useState } from 'react';
import { SpreadsheetData } from '@/lib/types';
import { exportToExcel, exportToCsv } from '@/lib/excel-export';
import { generatePdfReport } from '@/lib/pdf-export';
import { 
  FileSpreadsheet, 
  FileDown, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles,
  Printer
} from 'lucide-react';

interface SpreadsheetViewerProps {
  initialData: SpreadsheetData;
  onUpdate?: (updated: SpreadsheetData) => void;
}

export const SpreadsheetViewer: React.FC<SpreadsheetViewerProps> = ({
  initialData,
  onUpdate
}) => {
  const [data, setData] = useState<SpreadsheetData>(initialData);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = data.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      const updatedRow = [...row];
      // Try to keep numbers as numbers if numeric
      const numericVal = Number(value);
      updatedRow[colIndex] = !isNaN(numericVal) && value.trim() !== '' ? numericVal : value;
      return updatedRow;
    });

    const updatedData = { ...data, rows: newRows };
    setData(updatedData);
    if (onUpdate) onUpdate(updatedData);
  };

  const handleAddRow = () => {
    const emptyRow = data.headers.map((_, i) => (i === 0 ? `Item ${data.rows.length + 1}` : 0));
    const updatedData = {
      ...data,
      rows: [...data.rows, emptyRow]
    };
    setData(updatedData);
    if (onUpdate) onUpdate(updatedData);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedRows = data.rows.filter((_, idx) => idx !== rowIndex);
    const updatedData = { ...data, rows: updatedRows };
    setData(updatedData);
    if (onUpdate) onUpdate(updatedData);
  };

  const handleExportExcel = () => {
    exportToExcel(data);
  };

  const handleExportCsv = () => {
    exportToCsv(data);
  };

  const handleExportPdf = () => {
    generatePdfReport({
      title: data.title,
      subtitle: data.description || 'Relatório de Dados Estruturados Ocypus',
      spreadsheet: data
    });
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-[#38161e] bg-[#0c0e14] shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      {/* Table Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d141a] bg-[#140c10] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/80 text-red-500 border border-red-700/40">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-100">{data.title || 'Planilha Ocypus'}</h4>
            {data.description && (
              <p className="text-[11px] text-zinc-400">{data.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons: Excel, CSV, PDF */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="btn-export-excel"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            title="Exportar para formato Microsoft Excel (.xlsx)"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            id="btn-export-pdf"
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 rounded-lg bg-red-700/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors shadow-[0_0_10px_rgba(220,38,38,0.3)]"
            title="Exportar Relatório Formatado em PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Relatório PDF</span>
          </button>

          <button
            id="btn-export-csv"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-[#3b1822] bg-[#19141c] px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#251722] hover:text-white transition-colors"
            title="Exportar CSV"
          >
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Interactive Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="border-b border-[#2d141a] bg-[#1b0d12] text-[11px] font-bold uppercase tracking-wider text-red-400">
            <tr>
              <th className="w-10 px-3 py-2.5 text-center text-zinc-500">#</th>
              {data.headers.map((header, colIdx) => (
                <th key={colIdx} className="px-3 py-2.5 font-bold border-r border-[#261016] last:border-r-0">
                  {header}
                </th>
              ))}
              <th className="w-10 px-2 py-2.5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#221016]">
            {data.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-[#150d12]/60 transition-colors group">
                <td className="px-3 py-2 text-center font-mono text-[10px] text-zinc-500 bg-[#090b10]">
                  {rowIdx + 1}
                </td>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="p-1 border-r border-[#1f0e14] last:border-r-0">
                    <input
                      type="text"
                      value={cell !== null && cell !== undefined ? String(cell) : ''}
                      onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                      className="w-full rounded bg-transparent px-2 py-1 text-xs text-zinc-200 focus:bg-[#1e1117] focus:text-white focus:outline-none focus:ring-1 focus:ring-red-600 transition-all font-mono"
                    />
                  </td>
                ))}
                <td className="px-2 py-1 text-center">
                  <button
                    onClick={() => handleDeleteRow(rowIdx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-opacity"
                    title="Excluir linha"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Add Row + Summary Cards */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#261218] bg-[#0c0e14] p-3">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1.5 rounded-lg border border-[#3b1722] bg-[#160d12] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-red-600/50 hover:bg-[#201018] hover:text-red-400 transition-colors"
        >
          <Plus className="h-3.5 w-3.5 text-red-500" />
          <span>Adicionar Linha</span>
        </button>

        {data.summary && data.summary.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {data.summary.map((sum, sIdx) => (
              <div
                key={sIdx}
                className="flex items-center gap-2 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-1 text-xs"
              >
                <span className="text-zinc-400 font-medium">{sum.label}:</span>
                <span className="font-bold text-red-400 font-mono">{sum.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
