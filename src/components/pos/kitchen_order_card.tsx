import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";
import type { Order } from "@/context/orders_context";

interface Props {
  order: Order;
  getTimeElapsed: (timestamp: Date) => string;
  updateOrderStatus: (id: string, status: "pending" | "completed" | "cancelled") => void;
}

export function KitchenOrderCard({ order, getTimeElapsed, updateOrderStatus }: Props) {
  return (
    <Card className="flex flex-col border-2 overflow-hidden shadow-md">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-black">
            #{order.id.slice(0, 4)}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm bg-black/20 px-2 py-1 rounded font-medium">
            <Clock size={14} />
            {getTimeElapsed(order.timestamp)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {order.items.map((item) => (
            <div key={item.cartId} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex gap-2">
                <span className="font-bold text-lg">{item.quantity}x</span>
                <span className="text-lg font-medium">{item.name}</span>
              </div>
              {item.customizations.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {item.customizations.map((customization) => (
                    <li key={customization.id} className={`text-sm flex items-center gap-2 pl-6 ${customization.label.startsWith('Sin') ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                      - {customization.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 bg-background border-t border-border mt-auto">
          <Button
            className="w-full text-lg font-bold h-14 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => updateOrderStatus(order.id, "completed")}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Marcar como Lista
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
