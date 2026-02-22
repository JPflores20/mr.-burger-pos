import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  UserPlus, Pencil, Trash2, Users, ToggleLeft, ToggleRight,
  Mail, Lock, User, ArrowLeft, AlertTriangle,
} from "lucide-react";
import { useCashiers, getFullName, type CashierProfile } from "@/hooks/use_cashiers";

interface Props {
  open: boolean;
  onClose: () => void;
}

type View = "list" | "form" | "confirm-delete";
type FormMode = "add" | "edit";

interface FormState {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  email: string;
  password: string;
}

const EMPTY_FORM: FormState = {
  firstName: "",
  paternalLastName: "",
  maternalLastName: "",
  email: "",
  password: "",
};

export default function CashierManagementModal({ open, onClose }: Props) {
  const { cashiers, loading, addCashier, updateCashier, deleteCashier } = useCashiers();

  const [view, setView] = useState<View>("list");
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [selectedCashier, setSelectedCashier] = useState<CashierProfile | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const field = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const goList = () => { setView("list"); setSelectedCashier(null); setForm(EMPTY_FORM); };

  const openAdd = () => {
    setFormMode("add");
    setSelectedCashier(null);
    setForm(EMPTY_FORM);
    setView("form");
  };

  const openEdit = (cashier: CashierProfile) => {
    setFormMode("edit");
    setSelectedCashier(cashier);
    setForm({ firstName: cashier.firstName, paternalLastName: cashier.paternalLastName, maternalLastName: cashier.maternalLastName, email: cashier.email, password: "" });
    setView("form");
  };

  const openDelete = (cashier: CashierProfile) => {
    setSelectedCashier(cashier);
    setView("confirm-delete");
  };

  const handleSubmit = async () => {
    if (!form.firstName.trim()) { toast.error("El nombre es obligatorio."); return; }
    if (!form.paternalLastName.trim()) { toast.error("El apellido paterno es obligatorio."); return; }
    if (formMode === "add") {
      if (!form.email.trim()) { toast.error("El correo es obligatorio."); return; }
      if (form.password.length < 6) { toast.error("La contraseña debe tener al menos 6 caracteres."); return; }
    }

    setSubmitting(true);
    try {
      if (formMode === "add") {
        await addCashier(
          form.firstName.trim(),
          form.paternalLastName.trim(),
          form.maternalLastName.trim(),
          form.email.trim(),
          form.password
        );
        toast.success(`✅ Cajero "${form.firstName} ${form.paternalLastName}" creado correctamente.`, { duration: 3000 });
      } else if (selectedCashier) {
        await updateCashier(selectedCashier.id, {
          firstName: form.firstName.trim(),
          paternalLastName: form.paternalLastName.trim(),
          maternalLastName: form.maternalLastName.trim()
        });
        toast.success("✅ Cajero actualizado correctamente.", { duration: 3000 });
      }
      
      // Limpiamos y regresamos después del éxito
      setForm(EMPTY_FORM);
      setView("list");
      setSelectedCashier(null);
    } catch (error: any) {
      console.error("Submit error:", error);
      const code = error?.code;
      if (code === "auth/email-already-in-use") toast.error("Ese correo ya está registrado en el sistema.");
      else if (code === "auth/invalid-email") toast.error("El correo no tiene un formato válido.");
      else toast.error("Error al guardar: " + (error?.message ?? "intenta de nuevo."));
    } finally {
      setSubmitting(false);
    }
  };


  const handleToggleActive = async (cashier: CashierProfile) => {
    try {
      updateCashier(cashier.id, { active: !cashier.active });
      const name = getFullName(cashier);
      toast.success(cashier.active ? `"${name}" desactivado.` : `"${name}" activado.`);
    } catch {
      toast.error("No se pudo cambiar el estado.");
    }
  };

  const handleDelete = async () => {
    if (!selectedCashier) return;
    setSubmitting(true);
    try {
      deleteCashier(selectedCashier.id);
      toast.success(`Cajero "${getFullName(selectedCashier)}" eliminado.`);
      goList();
    } catch {
      toast.error("No se pudo eliminar el cajero.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSheetClose = (v: boolean) => {
    if (!v) { goList(); onClose(); }
  };

  const formTitle = formMode === "add" ? "Agregar Cajero" : "Editar Cajero";

  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
      <SheetContent side="left" className="w-[420px] sm:w-[480px] flex flex-col bg-card border-border p-0">

        {/* ── VISTA: LISTA ── */}
        {view === "list" && (
          <>
            <SheetHeader className="px-6 py-5 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users size={20} className="text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-foreground text-base font-bold">Gestión de Cajeros</SheetTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cashiers.length} perfil{cashiers.length !== 1 ? "es" : ""} registrado{cashiers.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                  <UserPlus size={15} /> Nuevo
                </Button>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loading && <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Cargando perfiles...</div>}
              {!loading && cashiers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                  <Users size={48} className="opacity-20" />
                  <p className="text-sm font-medium">No hay cajeros registrados</p>
                  <p className="text-xs">Presiona "Nuevo" para agregar el primero.</p>
                </div>
              )}
              {cashiers.map((cashier) => {
                const fullName = getFullName(cashier);
                return (
                  <div key={cashier.id} className="flex items-center gap-3 bg-secondary/40 rounded-xl p-3 border border-border/50 hover:border-border transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shrink-0">
                      {cashier.firstName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{cashier.email}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">Creado: {cashier.createdAt.toLocaleDateString("es-MX")}</p>
                    </div>
                    <Badge variant={cashier.active ? "default" : "secondary"} className={`text-[10px] px-1.5 py-0 shrink-0 ${cashier.active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-muted text-muted-foreground"}`}>
                      {cashier.active ? "Activo" : "Inactivo"}
                    </Badge>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleToggleActive(cashier)} title={cashier.active ? "Desactivar" : "Activar"} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                        {cashier.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => openEdit(cashier)} title="Editar" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => openDelete(cashier)} title="Eliminar" className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── VISTA: FORMULARIO ── */}
        {view === "form" && (
          <>
            <SheetHeader className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <button onClick={goList} className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <SheetTitle className="text-foreground text-base font-bold">{formTitle}</SheetTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{formMode === "add" ? "Completa los datos del nuevo cajero" : "Modifica los datos del cajero"}</p>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {[
                { key: "firstName", label: "Nombre(s)", placeholder: "Nombre(s)", required: true },
                { key: "paternalLastName", label: "Apellido Paterno", placeholder: "Apellido paterno", required: true },
                { key: "maternalLastName", label: "Apellido Materno", placeholder: "Apellido materno (opcional)", required: false },
              ].map(({ key, label, placeholder, required }) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                    {label} {required && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder={placeholder} className="pl-9 bg-secondary/50 border-border h-10" value={form[key as keyof FormState]} onChange={field(key as keyof FormState)} />
                  </div>
                </div>
              ))}

              <div className="space-y-1.5">
                <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                  Correo Electrónico {formMode === "add" && <span className="text-destructive">*</span>}
                </Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="correo@ejemplo.com" className="pl-9 bg-secondary/50 border-border h-10" value={form.email} disabled={formMode === "edit"} onChange={field("email")} />
                </div>
                {formMode === "edit" && <p className="text-[11px] text-muted-foreground">El correo no se puede modificar.</p>}
              </div>

              {formMode === "add" && (
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                    Contraseña <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input type="password" placeholder="Mínimo 6 caracteres" className="pl-9 bg-secondary/50 border-border h-10" value={form.password} onChange={field("password")} />
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3">
              <Button variant="outline" className="flex-1 border-border text-muted-foreground" onClick={goList}>
                Cancelar
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Guardando..." : formMode === "add" ? "Crear Cajero" : "Guardar Cambios"}
              </Button>
            </div>
          </>
        )}

        {/* ── VISTA: CONFIRMAR ELIMINACIÓN ── */}
        {view === "confirm-delete" && selectedCashier && (
          <>
            <SheetHeader className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <button onClick={goList} className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <SheetTitle className="text-foreground text-base font-bold">Eliminar Cajero</SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle size={32} className="text-destructive" />
              </div>
              <div className="space-y-2">
                <p className="text-foreground font-bold text-lg">{getFullName(selectedCashier)}</p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                   <p className="text-sm truncate max-w-[200px]">{selectedCashier.email}</p>
                   <button 
                    onClick={() => {
                        navigator.clipboard.writeText(selectedCashier.email);
                        toast.success("Correo copiado");
                    }}
                    className="p-1 hover:text-primary transition-colors"
                    title="Copiar correo"
                   >
                     <Users size={14} />
                   </button>
                </div>
                <p className="text-muted-foreground text-xs mt-4">
                  El acceso ha sido bloqueado en el sistema, pero para liberar el correo y borrarlo de la lista de Google, debes hacerlo manualmente en:
                </p>
                <a 
                  href="https://console.firebase.google.com/project/mrburguer-c5f7d/authentication/users" 
                  target="_blank" 
                  className="text-primary text-[10px] font-bold hover:underline"
                >
                  IR A CONSOLA DE FIREBASE →
                </a>
              </div>
            </div>


            <div className="px-6 py-4 border-t border-border flex gap-3">
              <Button variant="outline" className="flex-1 border-border text-muted-foreground" onClick={goList}>
                Cancelar
              </Button>
              <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleDelete} disabled={submitting}>
                {submitting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
