import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import type { Order } from "@/context/orders_types";

export const exportOrdersToPDF = (orders: Order[], dailyTotal: number) => {
  try {
    const doc = new jsPDF();
    
    // --- Configuración de Colores ---
    const primaryRed = [220, 38, 38] as [number, number, number];
    const darkGray = [55, 65, 81] as [number, number, number];
    const lightGray = [243, 244, 246] as [number, number, number];

    // --- Encabezado ---
    // Fondo decorativo arriba
    doc.setFillColor(primaryRed[0], primaryRed[1], primaryRed[2]);
    doc.rect(0, 0, 210, 40, "F");

    // Título Principal
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("MR. BURGER", 14, 25);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("REPORTE DE CORTE DE CAJA", 14, 33);

    // Fecha y Hora (Lado derecho)
    const dateStr = new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.setFontSize(10);
    doc.text(`Generado el: ${dateStr}`, 196, 25, { align: "right" });
    doc.text(`Hora: ${timeStr}`, 196, 32, { align: "right" });

    // --- Resumen de Ventas ---
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Resumen Diario", 14, 55);

    doc.setDrawColor(primaryRed[0], primaryRed[1], primaryRed[2]);
    doc.setLineWidth(1);
    doc.line(14, 58, 55, 58);

    // Cuadro de Total
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(14, 65, 182, 20, 2, 2, "F");
    
    doc.setFontSize(12);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text("TOTAL GENERADO:", 25, 78);
    
    doc.setFontSize(20);
    doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
    doc.text(`$${dailyTotal.toFixed(2)}`, 190, 78, { align: "right" });

    // --- Tabla de Detalles ---
    const tableData = orders.map((order) => {
      const orderTime = new Date(order.timestamp).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const itemsStr = order.items
        .map((item) => `${item.quantity}x ${item.name}`)
        .join("\n");

      return [
        `#${order.orderNumber || order.id.slice(0, 8).toUpperCase()}`,
        orderTime,
        itemsStr,
        order.paymentMethod.toUpperCase(),
        order.cashierName || "S/N",
        `$${order.total.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: 95,
      head: [["ORDEN", "HORA", "DESGLOSE DE PRODUCTOS", "MÉTODO", "CAJERO", "TOTAL"]],
      body: tableData,
      theme: "grid",
      styles: { 
        fontSize: 9, 
        cellPadding: 4,
        valign: 'middle'
      },
      headStyles: { 
        fillColor: primaryRed,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: 'center'
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: primaryRed },
        2: { cellWidth: 70 },
        5: { halign: 'right', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      }
    });

    // --- Pie de Página ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Página ${i} de ${pageCount} - Mr. Burger Punto de Venta`,
          105,
          285,
          { align: "center" }
        );
    }

    const filenameDate = new Date().toISOString().split("T")[0];
    doc.save(`Corte_Caja_MrBurger_${filenameDate}.pdf`);
    toast.success("PDF generado correctamente");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Hubo un error al generar el PDF");
  }
};
