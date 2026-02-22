import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const FIREBASE_API_KEY = "AIzaSyA4LKOCgsPnN4mRlC0MN9SDUmyKxAE5Jy8";

export interface CashierProfile {
  id: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  email: string;
  active: boolean;
  createdAt: Date;
}

export function getFullName(cashier: Pick<CashierProfile, "firstName" | "paternalLastName" | "maternalLastName">): string {
  return `${cashier.firstName} ${cashier.paternalLastName} ${cashier.maternalLastName}`.trim();
}

export function useCashiers() {
  const [cashiers, setCashiers] = useState<CashierProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Iniciando escucha de colección 'cashiers'...");
    const unsubscribe = onSnapshot(collection(db, "cashiers"), 
      (snapshot) => {
        console.log(`Snapshot recibido: ${snapshot.docs.length} documentos encontrados.`);
        const data: CashierProfile[] = snapshot.docs.map((docSnap) => {
          const rawData = docSnap.data();
          return {
            id: docSnap.id,
            firstName: rawData.firstName || rawData.name || "Sin nombre",
            paternalLastName: rawData.paternalLastName || "",
            maternalLastName: rawData.maternalLastName || "",
            email: rawData.email || "",
            active: rawData.active ?? true,
            createdAt: rawData.createdAt?.toDate?.() || new Date(),
          };
        });
        
        const sorted = data.sort((a, b) => {
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return timeB - timeA;
        });

        setCashiers(sorted);
        setLoading(false);
      },
      (error) => {
        console.error("ERROR CRÍTICO en useCashiers:", error);
        setLoading(false);
        toast.error("Error de conexión con la base de datos.");
      }
    );
    return unsubscribe;
  }, []);



  const addCashier = async (
    firstName: string,
    paternalLastName: string,
    maternalLastName: string,
    email: string,
    password: string
  ) => {
    // 1. Crear el usuario en Firebase Auth vía REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: false }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      const code = json?.error?.message ?? "";
      if (code === "EMAIL_EXISTS") throw { code: "auth/email-already-in-use" };
      if (code === "INVALID_EMAIL") throw { code: "auth/invalid-email" };
      if (code.includes("WEAK_PASSWORD")) throw { code: "auth/weak-password" };
      throw new Error(code || "Error al crear el usuario.");
    }

    // 2. Guardar el perfil en Firestore
    // NO usamos await aquí. Firestore gestiona la cola de escritura localmente de forma instantánea.
    // Esto evita que la UI se quede "pensando" mientras el servidor de Google responde.
    addDoc(collection(db, "cashiers"), {
      firstName,
      paternalLastName,
      maternalLastName,
      email,
      uid: json.localId ?? "",
      active: true,
      createdAt: Timestamp.now(),
    }).catch(e => {
      console.error("Error diferido de Firestore:", e);
      toast.error("Error al sincronizar el perfil. Verifica la conexión.");
    });
  };


  const updateCashier = (
    id: string,
    data: Partial<Pick<CashierProfile, "firstName" | "paternalLastName" | "maternalLastName" | "active">>
  ) => {
    updateDoc(doc(db, "cashiers", id), data).catch(e => {
      console.error("Error al actualizar cajero:", e);
      toast.error("Error al actualizar perfil.");
    });
  };

  const deleteCashier = (id: string) => {
    deleteDoc(doc(db, "cashiers", id)).catch(e => {
      console.error("Error al eliminar cajero:", e);
      toast.error("Error al eliminar perfil.");
    });
  };

  return { cashiers, loading, addCashier, updateCashier, deleteCashier };
}
