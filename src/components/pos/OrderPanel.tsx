import { Minus, Plus, Trash2, CreditCard, Banknote, ArrowRightLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PaymentMethod = "cash" | "transfer";

export default function OrderPanel() {
  const { items, updateQty, removeItem, clearCart, subtotal, tax, total } = useCart();
  const { addOrder } = useOrders();
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState<string>("");

  const handleConfirmClick = () => {
    if (items.length === 0) return;
    if (payment === "cash") {
      setAmountReceived("");
      setShowPaymentModal(true);
    } else {
      finalizeOrder();
    }
  };

  const finalizeOrder = (change?: number) => {
    addOrder({
      items,
      subtotal,
      tax,
      total,
      paymentMethod: paymentOptions.find((p) => p.id === payment)?.label || "Desconocido",
    });
    
    let msg = `¡Orden confirmada! Total: $${total.toFixed(2)} — ${payment.toUpperCase()}`;
    if (change !== undefined && change > 0) {
      msg += ` (Cambio: $${change.toFixed(2)})`;
    }
    
    toast.success(msg);
    clearCart();
    setShowPaymentModal(false);
  };

  // Focus input when modal opens
  useEffect(() => {
    if (showPaymentModal) {
      setTimeout(() => document.getElementById("amount-received")?.focus(), 100);
    }
  }, [showPaymentModal]);

  const numericReceived = parseFloat(amountReceived) || 0;
  const changeAmount = numericReceived - total;
  const canConfirmCash = numericReceived >= total;

  const paymentOptions: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
    { id: "cash", label: "Efectivo", icon: Banknote },
    { id: "transfer", label: "Transferencia", icon: ArrowRightLeft },
  ];

  return (
    <aside className="flex h-screen w-80 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <ShoppingCart size={18} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Orden Actual</h2>
        <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
          {items.length}
        </span>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <ShoppingCart size={40} strokeWidth={1} />
            <p className="text-sm">Sin artículos aún</p>
          </div>
        )}
        {items.map((item) => {
          const customPrice = item.customizations.reduce((s, c) => s + c.price, 0);
          const lineTotal = (item.basePrice + customPrice) * item.quantity;
          return (
            <div key={item.cartId} className="rounded-lg border border-border bg-secondary/50 p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.image} {item.name}
                  </p>
                  {item.customizations.length > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {item.customizations.map((c) => c.label).join(", ")}
                    </p>
                  )}
                </div>
                <button onClick={() => removeItem(item.cartId)} className="text-destructive hover:text-destructive/80 ml-1">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 border-border"
                    onClick={() => updateQty(item.cartId, -1)}
                  >
                    <Minus size={12} />
                  </Button>
                  <span className="w-7 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 border-border"
                    onClick={() => updateQty(item.cartId, 1)}
                  >
                    <Plus size={12} />
                  </Button>
                </div>
                <span className="text-sm font-bold text-primary">${lineTotal.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-3">
        {/* Totals */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>IVA (16%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-black text-foreground pt-1 border-t border-border">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="flex gap-1">
          {paymentOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPayment(opt.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold uppercase transition-colors",
                payment === opt.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <opt.icon size={16} />
              {opt.label}
            </button>
          ))}
        </div>

        {payment === "transfer" && (
          <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground border border-border animate-in fade-in slide-in-from-top-1">
            <p className="font-bold text-foreground mb-1">Datos para Transferencia</p>
            <p className="flex justify-between"><span>Banco:</span> <span className="font-semibold text-foreground">BANAMEX</span></p>
            <p className="flex justify-between mt-0.5"><span>Cuenta:</span> <span className="font-mono font-semibold text-foreground tracking-wider">5204 1660 4489 1093</span></p>
            <p className="flex justify-between mt-0.5"><span>Titular:</span> <span className="font-semibold text-foreground">Mayra Denisse Flores Carrillo</span></p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-border text-muted-foreground hover:text-destructive"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Limpiar
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            onClick={handleConfirmClick}
            disabled={items.length === 0}
          >
            Confirmar Orden
          </Button>
        </div>
      </div>

      {/* Cash Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl">Calculadora de Cambio</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-muted-foreground">Total a Pagar:</span>
              <span className="font-black text-2xl text-foreground">${total.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount-received" className="text-muted-foreground hidden">Monto Recibido</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">$</span>
                <Input
                  id="amount-received"
                  type="number"
                  placeholder="Monto recibido del cliente..."
                  className="pl-8 text-xl h-14 bg-secondary border-none"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canConfirmCash) {
                      e.preventDefault();
                      finalizeOrder(changeAmount);
                    }
                  }}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-lg p-4 rounded-xl bg-secondary/50 border border-border">
              <span className="text-muted-foreground">Cambio a entregar:</span>
              <span className={cn(
                "font-black text-3xl",
                amountReceived === "" ? "text-muted-foreground" :
                changeAmount >= 0 ? "text-green-500" : "text-destructive"
              )}>
                ${amountReceived === "" ? "0.00" : changeAmount.toFixed(2)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="border-border">
              Cancelar
            </Button>
            <Button 
              onClick={() => finalizeOrder(changeAmount)} 
              disabled={!canConfirmCash}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold"
            >
              Completar Pago ↵
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
