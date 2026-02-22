import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";

export const ADMIN_EMAILS = ["pepe.jlfc.16@gmail.com", "admin@mrburger.com", "mayra_dense@hotmail.com"];

interface AuthContextType {
  currentUser: User | null;
  userName: string;
  isAdmin: boolean;
  isCashier: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userName: "",
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
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCashier, setIsCashier] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchamos el cambio de sesión (Auth) - Esto es muy rápido
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (!user) {
        setUserName("");
        setIsAdmin(false);
        setIsCashier(false);
        setLoading(false);
        return;
      }

      // Si es Admin, acceso total inmediato
      if (ADMIN_EMAILS.includes(user.email ?? "")) {
        setUserName("Administrador");
        setIsAdmin(true);
        setIsCashier(false);
        setLoading(false);
        return;
      }

      // --- VALIDACIÓN DE CAJERO (Súper Estable) ---
      const q = query(
        collection(db, "cashiers"),
        where("uid", "==", user.uid)
      );

      const unsubscribeCashier = onSnapshot(q, (snapshot) => {
        // Si el snapshot viene del caché y está vacío, ignoramos (esperamos al servidor)
        if (snapshot.empty && snapshot.metadata.fromCache) {
          return; 
        }

        if (snapshot.empty) {
          // Si realmente está vacío después de consultar el servidor
          console.warn("No se encontró perfil para:", user.email);
          signOut(auth);
          toast.error("Sesión terminada: Perfil no encontrado.");
          return;
        }

        const data = snapshot.docs[0].data();
        
        // Verificación de estado activo
        if (data.active === false) {
          signOut(auth);
          toast.error("Tu cuenta ha sido desactivada.");
          return;
        }

        // Usuario válido y sincronizado
        setUserName(data.firstName || "Cajero");
        setIsAdmin(false);
        setIsCashier(true);
        setLoading(false);
      }, (error) => {
        console.error("Error en listener de cajero:", error);
        // En caso de error de red, permitimos el acceso si ya estábamos logueados (offline mode)
        setLoading(false);
      });


      return () => unsubscribeCashier();
    });

    return unsubscribeAuth;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const value = { currentUser, userName, isAdmin, isCashier, loading, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
