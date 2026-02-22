import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/cart_context";
import type { Order } from "@/context/orders_types";
import { useOrders } from "@/context/orders_context";
import { useAuth } from "@/context/auth_context";
import type { PaymentMethod } from "./order_panel";
import { Banknote, ArrowRightLeft } from "lucide-react";

export function useOrderPanel() {
  const { userName } = useAuth();
  const cartProps = useCart();
  const { items, subtotal, tax, total, clearCart } = cartProps;
  const { addOrder } = useOrders();
  
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState<string>("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [lastAmountReceived, setLastAmountReceived] = useState<number>(0);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState<"local" | "para-llevar" | "plataformas">("local");
  const receiptRef = useRef<HTMLDivElement>(null);

  const paymentOptions: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
    { id: "cash", label: "Efectivo", icon: Banknote },
    { id: "transfer", label: "Transferencia", icon: ArrowRightLeft },
  ];

  const numericReceived = parseFloat(amountReceived) || 0;
  const changeAmount = numericReceived - total;
  const canConfirmCash = numericReceived >= total;

  useEffect(() => {
    if (showPaymentModal) {
      setTimeout(() => document.getElementById("amount-received")?.focus(), 100);
    }
  }, [showPaymentModal]);

  const finalizeOrder = (change?: number) => {
    try {
      const newOrder = addOrder({
        items,
        subtotal,
        tax,
        total,
        paymentMethod: paymentOptions.find((p) => p.id === payment)?.label || "Desconocido",
        cashierName: userName,
        customerName: customerName.trim() || null, 
        orderType: orderType,
      });
      
      let message = `¡Orden confirmada! Total: $${total.toFixed(2)} — ${payment.toUpperCase()}`;
      if (change !== undefined && change > 0) {
        message += ` (Cambio: $${change.toFixed(2)})`;
      }
      
      toast.success(message);
      
      setCompletedOrder(newOrder);
      setLastAmountReceived(change !== undefined ? total + change : total);
      setShowPrintModal(true);
      clearCart();
      setCustomerName("");
      setOrderType("local");
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Error al finalizar la orden:", error);
      toast.error("Ocurrió un error al procesar el pago.");
    }
  };

  const handleConfirmClick = () => {
    if (items.length === 0) return;
    if (payment === "cash") {
      setAmountReceived("");
      setShowPaymentModal(true);
    } else {
      finalizeOrder();
    }
  };

  const closePrintModal = () => { setShowPrintModal(false); setCompletedOrder(null); };
  const handlePrint = () => { window.print(); closePrintModal(); };

  return {
    cartProps,
    payment,
    setPayment,
    showPaymentModal,
    setShowPaymentModal,
    amountReceived,
    setAmountReceived,
    completedOrder,
    lastAmountReceived,
    showPrintModal,
    customerName,
    setCustomerName,
    orderType,
    setOrderType,
    receiptRef,
    paymentOptions,
    numericReceived,
    changeAmount,
    canConfirmCash,
    finalizeOrder,
    handleConfirmClick,
    closePrintModal,
    handlePrint
  };
}
