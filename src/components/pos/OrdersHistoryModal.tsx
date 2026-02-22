import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/OrdersContext";
import { Receipt, DollarSign, Clock, CalendarDays, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function OrdersHistoryModal({ open, onClose }: Props) {
  const { orders, dailyTotal, removeOrder } = useOrders();
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [pin, setPin] = useState("");

  // Clear pin on open/close
  useEffect(() => {
    if (orderToDelete) {
      setPin("");
      setTimeout(() => document.getElementById("pin-input")?.focus(), 100);
    }
  }, [orderToDelete]);

  const handleDeleteConfirm = () => {
    if (pin === "4512" && orderToDelete) {
      removeOrder(orderToDelete);
      toast.success("Venta eliminada correctamente");
      setOrderToDelete(null);
    } else {
      toast.error("PIN incorrecto");
      setPin("");
    }
  };

  const handleExportPDF = () => {
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

      // Header
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
        headStyles: { fillColor: [220, 38, 38] }, // Red color matching theme roughly
      });

      // Total Line
      const finalY = (doc as any).lastAutoTable.finalY || 35;
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`Total Generado: $${dailyTotal.toFixed(2)}`, 14, finalY + 15);

      // Save PDF
      const filenameDate = new Date().toISOString().split("T")[0];
      doc.save(`Corte_Ventas_MrBurger_${filenameDate}.pdf`);
      toast.success("PDF generado correctamente");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Hubo un error al generar el PDF");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] flex flex-col bg-card border-border p-0">
        <SheetHeader className="p-6 border-b border-border bg-secondary/30">
          <div className="flex justify-between items-start">
            <SheetTitle className="flex items-center gap-2 text-2xl font-black uppercase text-foreground">
              <Receipt className="text-primary" />
              Ventas del Día
            </SheetTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="border-primary text-primary hover:bg-primary/10"
              disabled={orders.length === 0}
            >
              Exportar a PDF
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 bg-background px-3 py-1.5 rounded-md border border-border">
              <CalendarDays size={16} />
              <span className="font-medium text-foreground">
                {new Date().toLocaleDateString("es-MX", { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-md font-bold">
              <DollarSign size={16} />
              <span>Total: ${dailyTotal.toFixed(2)}</span>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
              <Receipt size={48} className="opacity-20" />
              <p>No hay ventas registradas hoy</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-border bg-background p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3 group">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">#{order.id.slice(0, 8)}</span>
                      <div className="flex items-center gap-1 text-sm font-medium mt-1">
                        <Clock size={14} className="text-primary" />
                        {new Date(order.timestamp).toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' })}
                        <span className="ml-2 px-2 py-0.5 bg-secondary text-foreground text-[10px] rounded uppercase font-bold tracking-wider">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-lg font-black text-primary">
                        ${order.total.toFixed(2)}
                      </div>
                      <button 
                        onClick={() => setOrderToDelete(order.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar venta"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="space-y-2 mt-3">
                    {order.items.map((item) => (
                      <div key={item.cartId} className="flex justify-between text-sm">
                        <div className="flex gap-2">
                          <span className="font-bold text-muted-foreground">{item.quantity}x</span>
                          <span className="text-foreground">{item.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          ${((item.basePrice + item.customizations.reduce((s,c) => s+c.price, 0)) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>

      <Dialog open={!!orderToDelete} onOpenChange={(o) => !o && setOrderToDelete(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Eliminar Venta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Para eliminar esta venta, ingresa el PIN de seguridad.
            </p>
            <Input
              id="pin-input"
              type="password"
              inputMode="numeric"
              placeholder="PIN de 4 dígitos"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="text-center text-xl tracking-[1em] h-12"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleDeleteConfirm();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderToDelete(null)} className="border-border">
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Eliminar Definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
