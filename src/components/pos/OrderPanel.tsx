import { Minus, Plus, Trash2, CreditCard, Banknote, ArrowRightLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PaymentMethod = "cash" | "card" | "transfer";

export default function OrderPanel() {
  const { items, updateQty, removeItem, clearCart, subtotal, tax, total } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("cash");

  const handleConfirm = () => {
    if (items.length === 0) return;
    toast.success(`Order confirmed! Total: $${total.toFixed(2)} — ${payment.toUpperCase()}`);
    clearCart();
  };

  const paymentOptions: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
    { id: "cash", label: "Cash", icon: Banknote },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "transfer", label: "Transfer", icon: ArrowRightLeft },
  ];

  return (
    <aside className="flex h-screen w-80 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <ShoppingCart size={18} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Current Order</h2>
        <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
          {items.length}
        </span>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <ShoppingCart size={40} strokeWidth={1} />
            <p className="text-sm">No items yet</p>
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
            <span>Tax (16%)</span>
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

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-border text-muted-foreground hover:text-destructive"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Clear
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            onClick={handleConfirm}
            disabled={items.length === 0}
          >
            Confirm Order
          </Button>
        </div>
      </div>
    </aside>
  );
}
