import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, Pencil, Trash2, Users, ToggleLeft, ToggleRight, Mail, Lock, User } from "lucide-react";
import { useCashiers, getFullName, type CashierProfile } from "@/hooks/use_cashiers";

interface Props {
  open: boolean;
  onClose: () => void;
}

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

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [selectedCashier, setSelectedCashier] = useState<CashierProfile | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CashierProfile | null>(null);

  const field = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const openAdd = () => {
    setFormMode("add");
    setSelectedCashier(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (cashier: CashierProfile) => {
    setFormMode("edit");
    setSelectedCashier(cashier);
    setForm({
      firstName: cashier.firstName,
      paternalLastName: cashier.paternalLastName,
      maternalLastName: cashier.maternalLastName,
      email: cashier.email,
      password: "",
    });
    setFormOpen(true);
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
        toast.success(`Cajero "${form.firstName} ${form.paternalLastName}" creado correctamente.`);
      } else if (selectedCashier) {
        await updateCashier(selectedCashier.id, {
          firstName: form.firstName.trim(),
          paternalLastName: form.paternalLastName.trim(),
          maternalLastName: form.maternalLastName.trim(),
        });
        toast.success("Cajero actualizado correctamente.");
      }
      setFormOpen(false);
      setForm(EMPTY_FORM);
    } catch (error: any) {
      const code = error?.code;
      if (code === "auth/email-already-in-use") {
        toast.error("Ese correo ya está registrado en el sistema.");
      } else if (code === "auth/invalid-email") {
        toast.error("El correo no tiene un formato válido.");
      } else {
        toast.error("Error al guardar: " + (error?.message ?? "intenta de nuevo."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (cashier: CashierProfile) => {
    try {
      await updateCashier(cashier.id, { active: !cashier.active });
      const displayName = getFullName(cashier);
      toast.success(cashier.active ? `"${displayName}" desactivado.` : `"${displayName}" activado.`);
    } catch {
      toast.error("No se pudo cambiar el estado.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCashier(deleteTarget.id);
      toast.success(`Cajero "${getFullName(deleteTarget)}" eliminado.`);
      setDeleteTarget(null);
    } catch {
      toast.error("No se pudo eliminar el cajero.");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent side="left" className="w-[420px] sm:w-[480px] flex flex-col bg-card border-border p-0">
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
                <UserPlus size={15} />
                Nuevo
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
                Cargando perfiles...
              </div>
            )}
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
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      Creado: {cashier.createdAt.toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge
                      variant={cashier.active ? "default" : "secondary"}
                      className={`text-[10px] px-1.5 py-0 ${cashier.active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-muted text-muted-foreground"}`}
                    >
                      {cashier.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleActive(cashier)}
                      title={cashier.active ? "Desactivar" : "Activar"}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      {cashier.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => openEdit(cashier)}
                      title="Editar"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cashier)}
                      title="Eliminar"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={formOpen} onOpenChange={(v) => !v && setFormOpen(false)}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <UserPlus size={18} className="text-primary" />
              {formMode === "add" ? "Agregar Cajero" : "Editar Cajero"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nombre(s)"
                  className="pl-9 bg-secondary/50 border-border h-10"
                  value={form.firstName}
                  onChange={field("firstName")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                Apellido Paterno <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Apellido paterno"
                  className="pl-9 bg-secondary/50 border-border h-10"
                  value={form.paternalLastName}
                  onChange={field("paternalLastName")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                Apellido Materno
              </Label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Apellido materno (opcional)"
                  className="pl-9 bg-secondary/50 border-border h-10"
                  value={form.maternalLastName}
                  onChange={field("maternalLastName")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                Correo Electrónico {formMode === "add" && <span className="text-destructive">*</span>}
              </Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="pl-9 bg-secondary/50 border-border h-10"
                  value={form.email}
                  disabled={formMode === "edit"}
                  onChange={field("email")}
                />
              </div>
              {formMode === "edit" && (
                <p className="text-[11px] text-muted-foreground">El correo no se puede modificar.</p>
              )}
            </div>

            {formMode === "add" && (
              <div className="space-y-1.5">
                <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                  Contraseña <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    className="pl-9 bg-secondary/50 border-border h-10"
                    value={form.password}
                    onChange={field("password")}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" className="border-border text-muted-foreground" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Guardando..." : formMode === "add" ? "Crear Cajero" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">¿Eliminar cajero?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Se eliminará el perfil de{" "}
              <span className="font-bold text-foreground">
                {deleteTarget ? getFullName(deleteTarget) : ""}
              </span>{" "}
              ({deleteTarget?.email}) del sistema. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-muted-foreground bg-transparent">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
