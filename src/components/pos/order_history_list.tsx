import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Receipt, Clock, Trash2 } from "lucide-react";
import type { Order } from "@/context/orders_types";

interface Props {
  orders: Order[];
  isAdmin: boolean;
  attemptDelete: (id: string) => void;
}

export function OrderHistoryList({ orders, isAdmin, attemptDelete }: Props) {
  return (
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
                  {isAdmin && (
                    <button 
                      onClick={() => attemptDelete(order.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar venta"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
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
                      ${((item.basePrice + item.customizations.reduce((sum, customization) => sum + customization.price, 0)) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
