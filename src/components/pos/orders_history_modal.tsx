import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/orders_context";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth_context";
import { exportOrdersToPDF } from "@/lib/export_pdf";
import { OrderHistoryList } from "./order_history_list";
import { DeleteOrderDialog } from "./delete_order_dialog";
import { OrdersHistoryHeader } from "./orders_history_header";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function OrdersHistoryModal({ open, onClose }: Props) {
  const { orders, dailyTotal, removeOrder } = useOrders();
  const { isAdmin } = useAuth();
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [pin, setPin] = useState("");

  // Clear pin on open/close
  useEffect(() => {
    if (orderToDelete && !isAdmin) {
      setPin("");
      setTimeout(() => document.getElementById("pin-input")?.focus(), 100);
    }
  }, [orderToDelete, isAdmin]);

  const handleDeleteConfirm = () => {
    if (!orderToDelete) return;
    
    if (isAdmin || pin === "4512") {
      removeOrder(orderToDelete);
      toast.success("Venta eliminada correctamente");
      setOrderToDelete(null);
    } else {
      toast.error("PIN incorrecto");
      setPin("");
    }
  };

  const attemptDelete = (id: string) => {
    if (isAdmin) {
       removeOrder(id);
       toast.success("Venta eliminada por administrador");
    } else {
       // Conceptually this won't be hit if we hide the button, but keeping for safety
       setOrderToDelete(id);
    }
  };

  const handleExportPDF = () => {
    exportOrdersToPDF(orders, dailyTotal);
  };

  return (
    <Sheet open={open} onOpenChange={(isVisible) => !isVisible && onClose()}>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] flex flex-col bg-card border-border p-0">
        <OrdersHistoryHeader
          dailyTotal={dailyTotal}
          ordersCount={orders.length}
          onExportPDF={handleExportPDF}
        />

        <OrderHistoryList 
          orders={orders} 
          isAdmin={isAdmin} 
          attemptDelete={attemptDelete} 
        />
      </SheetContent>

      <DeleteOrderDialog
        orderToDelete={orderToDelete}
        isAdmin={isAdmin}
        setOrderToDelete={setOrderToDelete}
        pin={pin}
        setPin={setPin}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </Sheet>
  );
}
