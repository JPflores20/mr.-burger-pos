import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "./order_panel";

interface Props {
  subtotal: number;
  tax: number;
  total: number;
  payment: PaymentMethod;
  setPayment: (p: PaymentMethod) => void;
  paymentOptions: { id: PaymentMethod; label: string; icon: React.ElementType }[];
  clearCart: () => void;
  handleConfirmClick: () => void;
  itemsCount: number;
}

export function OrderTotals({
  subtotal,
  tax,
  total,
  payment,
  setPayment,
  paymentOptions,
  clearCart,
  handleConfirmClick,
  itemsCount,
}: Props) {
  return (
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
        {paymentOptions.map((paymentOption) => (
          <button
            key={paymentOption.id}
            onClick={() => setPayment(paymentOption.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold uppercase transition-colors",
              payment === paymentOption.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <paymentOption.icon size={16} />
            {paymentOption.label}
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
          disabled={itemsCount === 0}
        >
          Limpiar
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          onClick={handleConfirmClick}
          disabled={itemsCount === 0}
        >
          Confirmar Orden
        </Button>
      </div>
    </div>
  );
}
