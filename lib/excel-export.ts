import * as XLSX from 'xlsx';
import { SpreadsheetData } from './types';

export function exportToExcel(data: SpreadsheetData, fileName?: string): void {
  try {
    const wsData: (string | number)[][] = [
      data.headers,
      ...data.rows
    ];

    // If summary exists, append empty line then summary
    if (data.summary && data.summary.length > 0) {
      wsData.push([]);
      wsData.push(['--- RESUMO ---', '']);
      data.summary.forEach(item => {
        wsData.push([item.label, item.value]);
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto-size columns based on maximum length
    const colWidths = data.headers.map((h, colIndex) => {
      let maxLen = String(h).length;
      data.rows.forEach(row => {
        const cellValue = row[colIndex];
        if (cellValue !== undefined && cellValue !== null) {
          maxLen = Math.max(maxLen, String(cellValue).length);
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
    });

    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    const sheetTitle = (data.title || 'Planilha_Ocypus').slice(0, 31).replace(/[:\\\/\?\*\[\]]/g, '_');
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);

    const validFileName = (fileName || data.title || 'planilha_ocypus')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_');

    XLSX.writeFile(wb, `${validFileName}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    // Fallback to CSV
    exportToCsv(data, fileName);
  }
}

export function exportToCsv(data: SpreadsheetData, fileName?: string): void {
  try {
    const lines: string[] = [];
    // Header
    lines.push(data.headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(';'));
    
    // Rows
    data.rows.forEach(row => {
      lines.push(row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';'));
    });

    // Summary
    if (data.summary && data.summary.length > 0) {
      lines.push('');
      lines.push('"RESUMO";""');
      data.summary.forEach(s => {
        lines.push(`"${String(s.label).replace(/"/g, '""')}";"${String(s.value).replace(/"/g, '""')}"`);
      });
    }

    const csvContent = '\uFEFF' + lines.join('\r\n'); // UTF-8 BOM for Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName || 'planilha_ocypus'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Erro ao exportar CSV:', err);
  }
}
