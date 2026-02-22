import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "@/lib/firebase";
import { secondaryAuth } from "@/lib/secondary_firebase";

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
    const unsubscribe = onSnapshot(collection(db, "cashiers"), (snapshot) => {
      const data: CashierProfile[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        firstName: docSnap.data().firstName ?? docSnap.data().name ?? "",
        paternalLastName: docSnap.data().paternalLastName ?? "",
        maternalLastName: docSnap.data().maternalLastName ?? "",
        email: docSnap.data().email,
        active: docSnap.data().active ?? true,
        createdAt: docSnap.data().createdAt?.toDate() ?? new Date(),
      }));
      setCashiers(data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const addCashier = async (
    firstName: string,
    paternalLastName: string,
    maternalLastName: string,
    email: string,
    password: string
  ) => {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    await addDoc(collection(db, "cashiers"), {
      firstName,
      paternalLastName,
      maternalLastName,
      email,
      uid: credential.user.uid,
      active: true,
      createdAt: Timestamp.now(),
    });
    await signOut(secondaryAuth);
  };

  const updateCashier = async (
    id: string,
    data: Partial<Pick<CashierProfile, "firstName" | "paternalLastName" | "maternalLastName" | "active">>
  ) => {
    await updateDoc(doc(db, "cashiers", id), data);
  };

  const deleteCashier = async (id: string) => {
    await deleteDoc(doc(db, "cashiers", id));
  };

  return { cashiers, loading, addCashier, updateCashier, deleteCashier };
}
