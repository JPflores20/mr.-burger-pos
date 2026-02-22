import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, Timestamp, addDoc 
} from "firebase/firestore";
import { toast } from "sonner";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  timestamp: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  unit: string;
  cost?: number; // Costo por unidad
}

interface AdminContextType {
  expenses: Expense[];
  inventory: InventoryItem[];
  addExpense: (expense: Omit<Expense, "id" | "timestamp">) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, "id">) => Promise<void>;
  removeInventoryItem: (id: string) => Promise<void>;
  updateInventoryStock: (id: string, delta: number) => Promise<void>;
  setInventoryStock: (id: string, stock: number) => Promise<void>;
  totalExpenses: number;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Listen to Expenses
  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "expenses"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedExpenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Expense[];

      // Filter local for today (security)
      const today = new Date().toDateString();
      setExpenses(fetchedExpenses.filter(e => e.timestamp.toDateString() === today));
    });

    return () => unsubscribe();
  }, []);

  // Listen to Inventory
  useEffect(() => {
    const q = query(collection(db, "inventory"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedInventory = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InventoryItem[];
      setInventory(fetchedInventory);

      // ID fijo para evitar duplicados y facilitar el seguimiento
      const meatId = "main_patties";
      const hasMeat = fetchedInventory.some(i => i.id === meatId);

      if (!hasMeat) {
        setDoc(doc(db, "inventory", meatId), {
          name: "Carne de Hamburguesa",
          stock: 20,
          minStock: 10,
          unit: "Pzs",
          cost: 25 // Costo semilla
        }).catch(err => console.error("Error seeding meat:", err));
      }
    });

    return () => unsubscribe();
  }, []);

  const addExpense = async (expenseData: Omit<Expense, "id" | "timestamp">) => {
    try {
      await addDoc(collection(db, "expenses"), {
        ...expenseData,
        timestamp: Timestamp.now()
      });
      toast.success("Gasto registrado");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("No se pudo registrar el gasto");
    }
  };

  const removeExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      toast.success("Gasto eliminado");
    } catch (error) {
      console.error("Error removing expense:", error);
      toast.error("No se pudo eliminar el gasto");
    }
  };

  const addInventoryItem = async (itemData: Omit<InventoryItem, "id">) => {
    try {
      await addDoc(collection(db, "inventory"), itemData);
      toast.success("Ítem añadido al inventario");
    } catch (error) {
      console.error("Error adding inventory item:", error);
      toast.error("No se pudo añadir el ítem");
    }
  };

  const removeInventoryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "inventory", id));
      toast.success("Ítem eliminado del inventario");
    } catch (error) {
      console.error("Error removing inventory item:", error);
      toast.error("No se pudo eliminar el ítem");
    }
  };

  const updateInventoryStock = async (id: string, delta: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    try {
      await setDoc(doc(db, "inventory", id), {
        ...item,
        stock: Math.max(0, item.stock + delta)
      });
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const setInventoryStock = async (id: string, stock: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    try {
      await setDoc(doc(db, "inventory", id), {
        ...item,
        stock: Math.max(0, stock)
      });
    } catch (error) {
      console.error("Error setting stock:", error);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <AdminContext.Provider value={{ 
      expenses, inventory, addExpense, removeExpense, 
      addInventoryItem, removeInventoryItem,
      updateInventoryStock, setInventoryStock, totalExpenses 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
