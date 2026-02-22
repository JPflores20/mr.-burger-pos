import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth_context";

export function ProtectedRoute({ children, allowCashier = true }: { children: JSX.Element, allowCashier?: boolean }) {
  const { currentUser, isCashier, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-primary/20 rounded-full animate-bounce" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (isCashier && !allowCashier) {
    return <Navigate to="/" replace />;
  }

  return children;
}
