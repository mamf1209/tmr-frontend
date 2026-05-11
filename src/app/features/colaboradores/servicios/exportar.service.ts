import { Injectable } from '@angular/core';
import { Colaborador } from '../models/colaborador.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ExportarService {

  // ── EXPORTAR PDF ──────────────────────────────────────
  exportarPDF(colaboradores: Colaborador[]): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header azul
    doc.setFillColor(22, 53, 114);
    doc.rect(0, 0, 297, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE COLABORADORES', 148, 13, { align: 'center' });

    // Fecha
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const fecha = new Date().toLocaleDateString('es-EC', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    doc.text(`Generado el: ${fecha}`, 285, 13, { align: 'right' });

    // Tabla
    autoTable(doc, {
      startY: 26,
      head: [[
        'Identificación', 'Tipo', 'Nombre', 'Núm. Proyectos',
        'Correo electrónico', 'Cargo', 'Estado'
      ]],
      body: colaboradores.map(c => [
        c.identificacion,
        c.tipoIdentificacion,
        c.nombreCompleto,
        c.numProyectos.toString(),
        c.correoElectronico,
        c.cargo,
        c.estado,
      ]),
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 4,
        valign: 'middle',
      },
      headStyles: {
        fillColor: [22, 53, 114],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
      },
      bodyStyles: {
        textColor: [55, 65, 81],
      },
      alternateRowStyles: {
        fillColor: [245, 247, 255],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 30 },
        1: { halign: 'center', cellWidth: 15 },
        2: { cellWidth: 45 },
        3: { halign: 'center', cellWidth: 25 },
        4: { cellWidth: 60 },
        5: { cellWidth: 45 },
        6: { halign: 'center', cellWidth: 22 },
      },
      willDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 6) {
          const estado = data.cell.raw as string;
          if (estado === 'Activo') {
            data.cell.styles.textColor = [22, 163, 74];
          } else {
            data.cell.styles.textColor = [107, 114, 128];
          }
        }
      },
      margin: { left: 10, right: 10 },
      tableLineColor: [229, 231, 235],
      tableLineWidth: 0.1,
    });

    // Footer paginado
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Página ${i} de ${pageCount} — Integrity Solutions`,
        148, 205, { align: 'center' }
      );
    }

    doc.save(`colaboradores_${this.getFechaArchivo()}.pdf`);
  }

  // ── EXPORTAR EXCEL ────────────────────────────────────
  exportarExcel(colaboradores: Colaborador[]): void {
    const wb = XLSX.utils.book_new();

    // ── Hoja principal ──────────────────────────────────
    // Fila 1: título
    // Fila 2: fecha
    // Fila 3: headers
    // Fila 4+: datos

    const titulo  = [['REPORTE DE COLABORADORES — Integrity Solutions']];
    const subfila = [[`Generado el: ${new Date().toLocaleDateString('es-EC')}`]];
    const headers = [[
      '#', 'Identificación', 'Tipo', 'Nombre Completo',
      'Núm. Proyectos', 'Correo Electrónico', 'Cargo',
      'Departamento', 'Modalidad', 'Categoría',
      'Años Experiencia', 'Teléfono', 'Género',
      'Fecha Nacimiento', 'Fecha Contratación', 'Dirección', 'Estado'
    ]];
    const filas = colaboradores.map((c, i) => [
      i + 1,
      c.identificacion,
      c.tipoIdentificacion,
      c.nombreCompleto,
      c.numProyectos,
      c.correoElectronico,
      c.cargo,
      c.departamento,
      c.modalidad,
      c.categoria,
      c.aniosExperiencia,
      c.telefono,
      c.genero,
      this.formatFecha(c.fechaNacimiento),
      this.formatFecha(c.fechaContratacion),
      c.direccion,
      c.estado,
    ]);

    // Combinar todas las filas
    const todasLasFilas = [...titulo, ...subfila, ...headers, ...filas];
    const ws = XLSX.utils.aoa_to_sheet(todasLasFilas);

    // Ancho de columnas
    ws['!cols'] = [
      { wch: 5  },
      { wch: 16 },
      { wch: 8  },
      { wch: 30 },
      { wch: 15 },
      { wch: 35 },
      { wch: 25 },
      { wch: 22 },
      { wch: 13 },
      { wch: 13 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 12 },
    ];

    // Alto de filas título y subtítulo
    ws['!rows'] = [{ hpt: 22 }, { hpt: 14 }];

    XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');

    // ── Hoja resumen ────────────────────────────────────
    const wsResumen = XLSX.utils.aoa_to_sheet([
      ['RESUMEN DE COLABORADORES'],
      [''],
      ['Métrica', 'Total'],
      ['Total colaboradores',  colaboradores.length],
      ['Activos',   colaboradores.filter(c => c.estado === 'Activo').length],
      ['Inactivos', colaboradores.filter(c => c.estado === 'Inactivo').length],
      ['No asignados (0 proyectos)', colaboradores.filter(c => c.numProyectos === 0).length],
      ['Asignados (1+ proyectos)',   colaboradores.filter(c => c.numProyectos > 0).length],
    ]);

    wsResumen['!cols'] = [{ wch: 28 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

    XLSX.writeFile(wb, `colaboradores_${this.getFechaArchivo()}.xlsx`);
  }

  // ── Helpers ───────────────────────────────────────────
  private formatFecha(fecha: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  private getFechaArchivo(): string {
    const now = new Date();
    const d = now.getDate().toString().padStart(2, '0');
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const y = now.getFullYear();
    return `${d}-${m}-${y}`;
  }
}