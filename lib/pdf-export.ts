import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SpreadsheetData } from './types';

export interface PdfReportOptions {
  title: string;
  subtitle?: string;
  author?: string;
  sections?: {
    heading: string;
    content?: string;
    code?: { language: string; snippet: string };
    table?: SpreadsheetData;
  }[];
  spreadsheet?: SpreadsheetData;
  generalText?: string;
}

export function generatePdfReport(options: PdfReportOptions, fileName?: string): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Header Banner (Midnight Black + Blood Red accent line)
    doc.setFillColor(13, 14, 18); // Midnight Black
    doc.rect(0, 0, pageWidth, 32, 'F');

    // Blood red bottom border on header
    doc.setFillColor(185, 28, 28); // Blood Red #b91c1c
    doc.rect(0, 31, pageWidth, 1.5, 'F');

    // Ocypus Brand Title
    doc.setTextColor(239, 68, 68); // Bright blood red
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('OCYPUS AI', 14, 15);

    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Sistema Inteligente • Relatório Executivo & Extração', 14, 22);

    // Date / Time badge on top right
    const dateStr = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setTextColor(160, 160, 170);
    doc.setFontSize(8);
    doc.text(dateStr, pageWidth - 14, 15, { align: 'right' });
    if (options.author) {
      doc.text(`Usuário: ${options.author}`, pageWidth - 14, 21, { align: 'right' });
    }

    let currentY = 44;

    // Report Main Title
    doc.setTextColor(20, 20, 24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(options.title || 'Relatório de Análise e Dados', 14, currentY);
    currentY += 8;

    if (options.subtitle) {
      doc.setTextColor(90, 90, 100);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const splitSub = doc.splitTextToSize(options.subtitle, pageWidth - 28);
      doc.text(splitSub, 14, currentY);
      currentY += splitSub.length * 6 + 4;
    }

    // If general text exists
    if (options.generalText) {
      doc.setTextColor(50, 50, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(options.generalText, pageWidth - 28);
      
      // Check page break
      if (currentY + splitText.length * 5 > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }

      doc.text(splitText, 14, currentY);
      currentY += splitText.length * 5 + 8;
    }

    // If a primary spreadsheet is provided
    if (options.spreadsheet) {
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(options.spreadsheet.title || 'Tabela de Dados Extraídos', 14, currentY);
      currentY += 5;

      const head = [options.spreadsheet.headers];
      const body = options.spreadsheet.rows.map(row => row.map(c => String(c ?? '')));

      autoTable(doc, {
        head: head,
        body: body,
        startY: currentY,
        theme: 'striped',
        headStyles: {
          fillColor: [185, 28, 28], // Blood red
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [248, 248, 250]
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: [40, 40, 45]
        },
        margin: { left: 14, right: 14 }
      });

      // @ts-expect-error autoTable adds lastAutoTable to doc
      currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 10;

      if (options.spreadsheet.summary && options.spreadsheet.summary.length > 0) {
        if (currentY > pageHeight - 35) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFillColor(245, 245, 247);
        doc.roundedRect(14, currentY, pageWidth - 28, 6 + options.spreadsheet.summary.length * 6, 2, 2, 'F');
        doc.setTextColor(185, 28, 28);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('RESUMO ESTRUTURADO:', 18, currentY + 5);

        doc.setTextColor(60, 60, 70);
        doc.setFont('helvetica', 'normal');
        options.spreadsheet.summary.forEach((item, idx) => {
          doc.text(`${item.label}: ${item.value}`, 18, currentY + 11 + (idx * 6));
        });

        currentY += 12 + options.spreadsheet.summary.length * 6;
      }
    }

    // If additional sections are provided
    if (options.sections && options.sections.length > 0) {
      for (const sec of options.sections) {
        if (currentY > pageHeight - 40) {
          doc.addPage();
          currentY = 20;
        }

        doc.setTextColor(185, 28, 28);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(sec.heading, 14, currentY);
        currentY += 6;

        if (sec.content) {
          doc.setTextColor(50, 50, 60);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          const splitSec = doc.splitTextToSize(sec.content, pageWidth - 28);
          doc.text(splitSec, 14, currentY);
          currentY += splitSec.length * 5 + 6;
        }

        if (sec.code) {
          if (currentY > pageHeight - 40) {
            doc.addPage();
            currentY = 20;
          }
          doc.setFillColor(18, 19, 24);
          const splitCode = doc.splitTextToSize(sec.code.snippet, pageWidth - 36);
          const blockHeight = Math.min(splitCode.length * 4.2 + 8, 80);
          doc.rect(14, currentY, pageWidth - 28, blockHeight, 'F');

          doc.setTextColor(239, 68, 68);
          doc.setFont('courier', 'bold');
          doc.setFontSize(8);
          doc.text(`// ${sec.code.language.toUpperCase()}`, 18, currentY + 5);

          doc.setTextColor(220, 220, 230);
          doc.setFont('courier', 'normal');
          doc.setFontSize(7.5);
          doc.text(splitCode.slice(0, 16), 18, currentY + 10);
          currentY += blockHeight + 8;
        }

        if (sec.table) {
          const head = [sec.table.headers];
          const body = sec.table.rows.map(r => r.map(c => String(c ?? '')));
          autoTable(doc, {
            head: head,
            body: body,
            startY: currentY,
            headStyles: { fillColor: [185, 28, 28] },
            margin: { left: 14, right: 14 }
          });
          // @ts-expect-error autoTable adds lastAutoTable to doc
          currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 25) + 8;
        }
      }
    }

    // Footer on all pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(220, 220, 230);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

      doc.setTextColor(140, 140, 150);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Gerado automaticamente por Ocypus AI • Confidencial & Seguro', 14, pageHeight - 7);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
    }

    const cleanName = (fileName || options.title || 'relatorio_ocypus')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_');

    doc.save(`${cleanName}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
  }
}
