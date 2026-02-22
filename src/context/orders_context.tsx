import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import type { Order, OrdersContextValue } from "./orders_types";


const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          items: data.items,
          subtotal: data.subtotal,
          tax: data.tax,
          total: data.total,
          paymentMethod: data.paymentMethod,
          timestamp: data.timestamp?.toDate() || new Date(),
          status: data.status,
        };
      });
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  const addOrder = (orderData: Omit<Order, "id" | "timestamp" | "status">): Order => {
    const newId = crypto.randomUUID();
    const newOrder: Order = {
      ...orderData,
      id: newId,
      timestamp: new Date(),
      status: "pending",
    };
    
    const orderForDb = {
      ...newOrder,
      timestamp: Timestamp.fromDate(newOrder.timestamp),
    };
    setDoc(doc(db, "orders", newId), orderForDb).catch(console.error);
    
    setOrders((previousOrders) => [newOrder, ...previousOrders].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
    return newOrder;
  };

  const removeOrder = (id: string) => {
    deleteDoc(doc(db, "orders", id)).catch(console.error);
    setOrders((previousOrders) => previousOrders.filter((order) => order.id !== id));
  };

  const updateOrderStatus = (id: string, status: "pending" | "completed") => {
    updateDoc(doc(db, "orders", id), { status }).catch(console.error);
    setOrders((previousOrders) => 
      previousOrders.map((order) => 
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const dailyTotal = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, removeOrder, updateOrderStatus, clearOrders, dailyTotal }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within OrdersProvider");
  return context;
}
