import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/context/cart_context";

interface Props {
  items: CartItem[];
  updateQuantity: (cartId: string, delta: number) => void;
  removeItem: (cartId: string) => void;
}

export function OrderItemsList({ items, updateQuantity, removeItem }: Props) {
  return (
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
                  onClick={() => updateQuantity(item.cartId, -1)}
                >
                  <Minus size={12} />
                </Button>
                <span className="w-7 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 border-border"
                  onClick={() => updateQuantity(item.cartId, 1)}
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
  );
}
