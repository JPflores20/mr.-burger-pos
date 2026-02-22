import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, addDoc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import type { Order, OrdersContextValue } from "./orders_types";
import { toast } from "sonner";
import { useAdmin } from "./admin_context";

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { inventory, updateInventoryStock } = useAdmin();

  useEffect(() => {
    // Escucha en tiempo real de las órdenes en Firebase
    console.log("Iniciando listener de órdenes...");
    
    // Filtramos para obtener órdenes de hoy
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, "orders"), 
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          orderNumber: data.orderNumber ?? null,
          items: data.items || [],
          subtotal: data.subtotal || 0,
          tax: data.tax || 0,
          total: data.total || 0,
          paymentMethod: data.paymentMethod || "Desconocido",
          cashierName: data.cashierName || "Sistema",
          customerName: data.customerName ?? null,
          orderType: data.orderType || "local",
          timestamp: data.timestamp?.toDate() || new Date(),
          status: data.status || "pending",
        };
      });

      const today = new Date();
      const filtered = fetchedOrders.filter(order => {
        const orderDate = new Date(order.timestamp);
        return orderDate.getDate() === today.getDate() &&
               orderDate.getMonth() === today.getMonth() &&
               orderDate.getFullYear() === today.getFullYear();
      });

      setOrders(filtered);
    }, (error) => {
      console.error("Error al escuchar órdenes en Firebase:", error);
      toast.error("Error de conexión con el historial de ventas.");
    });

    return () => unsubscribe();
  }, []);

  const addOrder = (orderData: Omit<Order, "id" | "timestamp" | "status" | "orderNumber">): Order => {
    const orderRef = doc(collection(db, "orders"));
    const newId = orderRef.id;

    const maxOrderNumber = orders.reduce((max, o) => {
      const num = typeof o.orderNumber === 'number' ? o.orderNumber : 0;
      return Math.max(max, num);
    }, 0);
    
    const nextOrderNumber = maxOrderNumber + 1;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderNumber: nextOrderNumber,
      timestamp: new Date(),
      status: "pending",
    };

    // --- Deducción automática de Carne de Hamburguesa ---
    const meatItem = inventory.find(i => i.id === "main_patties") || 
                     inventory.find(i => 
                       i.name.toLowerCase().includes("carne") && 
                       i.name.toLowerCase().includes("hamburguesa")
                     );

    if (meatItem) {
      let pattiesToDeduct = 0;
      orderData.items.forEach(item => {
        let pattiesPerItem = 0;
        
        if (item.category === "burgers") {
          pattiesPerItem = 1;
        } else if (item.category === "combos") {
          const name = item.name.toLowerCase();
          if (name.includes("doble")) {
            pattiesPerItem = 2;
          } else if (name.includes("familiar")) {
            pattiesPerItem = 4;
          } else {
            pattiesPerItem = 1;
          }
        }

        // Sumar extras de carne
        const extraPatties = item.customizations?.filter(c => c.id === "extra-patty").length || 0;
        pattiesPerItem += extraPatties;

        pattiesToDeduct += (pattiesPerItem * item.quantity);
      });

      if (pattiesToDeduct > 0) {
        updateInventoryStock(meatItem.id, -pattiesToDeduct);
      }
    }

    const orderForDb = {
      ...newOrder,
      timestamp: Timestamp.fromDate(newOrder.timestamp),
    };

    setDoc(orderRef, orderForDb)
      .then(() => {
        console.log("Orden guardada exitosamente en Firebase con ID:", newId);
      })
      .catch((error) => {
        console.error("Error al guardar orden en Firebase:", error);
        toast.error("Error al sincronizar con la base de datos.");
      });

    return newOrder;
  };


  const removeOrder = (id: string) => {
    setOrders((current) => current.filter(o => o.id !== id));
    deleteDoc(doc(db, "orders", id))
      .catch((error) => {
        console.error("Error al eliminar orden:", error);
        toast.error("No se pudo eliminar la orden de la base de datos.");
      });
  };

  const updateOrderStatus = (id: string, status: "pending" | "completed") => {
    updateDoc(doc(db, "orders", id), { status })
      .then(() => {
        if (status === "completed") {
          toast.success("¡Orden lista!");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar estado:", error);
        toast.error("No se pudo actualizar el estado en la base de datos.");
      });
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
