import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem } from "./CartContext";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  timestamp: Date;
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "timestamp">) => void;
  removeOrder: (id: string) => void;
  clearOrders: () => void;
  dailyTotal: number;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (orderData: Omit<Order, "id" | "timestamp">) => {
    const newOrder: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const removeOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const dailyTotal = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, removeOrder, clearOrders, dailyTotal }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
