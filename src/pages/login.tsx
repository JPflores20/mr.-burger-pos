import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Store, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // El admin y tu correo entran garantizado al instante
      const isAdmin = email === "admin@mrburger.com" || email === "pepe.jlfc.16@gmail.com";
      
      if (isAdmin) {
        toast.success(`¡Bienvenido!`);
        navigate("/");
        return;
      }

      // Para los cajeros, dejamos que entren de inmediato para que la UI no se congele.
      // La validación se hace "en vuelo" hacia la página principal.
      // Si el cajero resultara estar inactivo, el sistema lo sacará automáticamente al cargar el Dashboard.
      toast.success("Iniciando sesión...");
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-11 h-12 bg-secondary/50 border-border"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
