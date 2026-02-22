import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import type { Order } from "@/context/orders_types";

export const exportOrdersToPDF = (orders: Order[], dailyTotal: number) => {
  try {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.setFontSize(20);
    doc.text("Corte de Caja - Mr. Burger", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha: ${dateStr} - ${timeStr}`, 14, 30);

    const tableData = orders.map((order) => {
      const orderTime = new Date(order.timestamp).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return [
        `#${order.id.slice(0, 8)}`,
        orderTime,
        order.paymentMethod,
        `$${order.total.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [["ID Orden", "Hora", "Método de Pago", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [220, 38, 38] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 35;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Total Generado: $${dailyTotal.toFixed(2)}`, 14, finalY + 15);

    const filenameDate = new Date().toISOString().split("T")[0];
    doc.save(`Corte_Ventas_MrBurger_${filenameDate}.pdf`);
    toast.success("PDF generado correctamente");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Hubo un error al generar el PDF");
  }
};
