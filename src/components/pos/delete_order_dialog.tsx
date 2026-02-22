import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  orderToDelete: string | null;
  isAdmin: boolean;
  setOrderToDelete: (id: string | null) => void;
  pin: string;
  setPin: (pin: string) => void;
  handleDeleteConfirm: () => void;
}

export function DeleteOrderDialog({
  orderToDelete,
  isAdmin,
  setOrderToDelete,
  pin,
  setPin,
  handleDeleteConfirm,
}: Props) {
  return (
    <Dialog open={!!orderToDelete && !isAdmin} onOpenChange={(isOpen) => !isOpen && setOrderToDelete(null)}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Eliminar Venta</DialogTitle>
          <DialogDescription className="sr-only">Ingresa el PIN de seguridad para confirmar la eliminación de esta venta.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Para eliminar esta venta, ingresa el PIN de seguridad.
          </p>
          <Input
            id="pin-input"
            type="password"
            inputMode="numeric"
            placeholder="PIN de 4 dígitos"
            maxLength={4}
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            className="text-center text-xl tracking-[1em] h-12"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleDeleteConfirm();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOrderToDelete(null)} className="border-border">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            Eliminar Definitivamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
