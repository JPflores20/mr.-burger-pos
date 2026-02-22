import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Store } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userName = userCredential.user.displayName ?? userCredential.user.email ?? "Usuario";
      toast.success(`¡Bienvenido, ${userName}!`);
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential" || errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
        toast.error("Correo o contraseña incorrectos.");
      } else {
        toast.error("Ocurrió un error al intentar iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
        {/* Header / Logo Area */}
        <div className="bg-primary p-8 text-center text-primary-foreground">
          <div className="bg-white/20 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
             <Store size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Mr. Burger</h1>
          <p className="text-primary-foreground/80 font-medium text-sm mt-1">Punto de Venta</p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Iniciar Sesión</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground font-semibold">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mrburger.com"
                  className="pl-10 h-12 bg-secondary/50 border-border"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground font-semibold">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-secondary/50 border-border"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold mt-4" 
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar al Sistema"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
