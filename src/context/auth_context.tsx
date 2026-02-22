import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ADMIN_EMAIL = "pepe.jlfc.16@gmail.com";

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isCashier: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  isCashier: false,
  loading: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCashier, setIsCashier] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setIsAdmin(false);
        setIsCashier(false);
        setLoading(false);
        return;
      }

      if (user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        setIsCashier(false);
        setLoading(false);
        return;
      }

      setIsAdmin(false);
      const q = query(
        collection(db, "cashiers"),
        where("email", "==", user.email),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      setIsCashier(!snapshot.empty);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const value = { currentUser, isAdmin, isCashier, loading, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
