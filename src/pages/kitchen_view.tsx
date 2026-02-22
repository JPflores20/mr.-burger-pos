import { ArrowLeft, CheckCircle2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth_context";
import { useOrders } from "@/context/orders_context";
import { Button } from "@/components/ui/button";
import { KitchenOrderCard } from "@/components/pos/kitchen_order_card";

function useForceUpdate() {
  const [value, setValue] = useState(0); 
  useEffect(() => {
    const interval = setInterval(() => setValue(value => value + 1), 60000);
    return () => clearInterval(interval);
  }, []);
  return value;
}

export default function KitchenView() {
  const { orders, updateOrderStatus } = useOrders();
  const { logout } = useAuth();
  const navigate = useNavigate();
  useForceUpdate();

  const pendingOrders = orders.filter((order) => order.status === "pending").sort((orderA, orderB) => orderA.timestamp.getTime() - orderB.timestamp.getTime());

  const getTimeElapsed = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 60000);
    if (diffInMinutes === 0) return "Justo ahora";
    if (diffInMinutes === 1) return "Hace 1 min";
    return `Hace ${diffInMinutes} mins`;
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")} className="bg-background">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-black uppercase text-foreground">👨‍🍳 Vista de Cocina</h1>
        </div>
        <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg font-bold text-muted-foreground shadow-sm">
          <span>{pendingOrders.length}</span>
          <span>Órdenes Pendientes</span>
        </div>
        <Button 
          variant="outline" 
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border" 
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Salir
        </Button>
      </div>

      {pendingOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground gap-4">
          <CheckCircle2 size={64} className="opacity-20 text-green-500" />
          <p className="text-2xl font-bold">¡La cocina está al día!</p>
          <p>No hay comandas pendientes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pendingOrders.map((order) => (
            <KitchenOrderCard 
              key={order.id} 
              order={order} 
              getTimeElapsed={getTimeElapsed} 
              updateOrderStatus={updateOrderStatus} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
