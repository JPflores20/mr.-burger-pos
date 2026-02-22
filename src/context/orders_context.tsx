import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, addDoc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import type { Order, OrdersContextValue } from "./orders_types";
import { toast } from "sonner";

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Escucha en tiempo real de las órdenes en Firebase
    console.log("Iniciando listener de órdenes...");
    
    // Filtramos para obtener órdenes de hoy (opcional, pero recomendado para 'Ventas del Día')
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    // Nota: Para filtrar por fecha en Firestore recomendamos un índice si se usa con orderBy.
    // Por ahora, traemos las últimas 100 o filtramos localmente si es necesario.
    const q = query(
      collection(db, "orders"), 
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Snapshot de órdenes recibido. Documentos: ${snapshot.docs.length}. De caché: ${snapshot.metadata.fromCache}`);
      
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
          timestamp: data.timestamp?.toDate() || new Date(),
          status: data.status || "pending",
        };
      });

      // Filtrar solo las de hoy localmente para mayor seguridad y evitar confusiones
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
    // Generamos una referencia de documento para obtener el ID de inmediato
    const orderRef = doc(collection(db, "orders"));
    const newId = orderRef.id;

    // Calcular el siguiente número de orden basado en las órdenes de hoy
    // Usamos el estado 'orders' que ya está filtrado por hoy en el listener
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

    // Preparamos el objeto para Firebase
    const orderForDb = {
      ...newOrder,
      timestamp: Timestamp.fromDate(newOrder.timestamp),
    };

    // Guardamos en Firestore
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
    // Actualización optimista: lo quitamos de la UI de inmediato
    setOrders((current) => current.filter(o => o.id !== id));

    deleteDoc(doc(db, "orders", id))
      .then(() => {
        console.log("Orden eliminada de Firebase:", id);
      })
      .catch((error) => {
        console.error("Error al eliminar orden:", error);
        toast.error("No se pudo eliminar la orden de la base de datos.");
        // Si falla, el listener de Firebase volverá a traer la orden eventualmente
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
