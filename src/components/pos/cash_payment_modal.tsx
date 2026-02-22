import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  total: number;
  amountReceived: string;
  setAmountReceived: (amount: string) => void;
  canConfirmCash: boolean;
  changeAmount: number;
  finalizeOrder: (change?: number) => void;
}

export function CashPaymentModal({
  show,
  setShow,
  total,
  amountReceived,
  setAmountReceived,
  canConfirmCash,
  changeAmount,
  finalizeOrder,
}: Props) {
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Calculadora de Cambio</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground">Total a Pagar:</span>
            <span className="font-black text-2xl text-foreground">${total.toFixed(2)}</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount-received" className="text-muted-foreground hidden">Monto Recibido</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">$</span>
              <Input
                id="amount-received"
                type="number"
                placeholder="Monto recibido del cliente..."
                className="pl-8 text-xl h-14 bg-secondary border-none"
                value={amountReceived}
                onChange={(event) => setAmountReceived(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && canConfirmCash) {
                    event.preventDefault();
                    finalizeOrder(changeAmount);
                  }
                }}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-lg p-4 rounded-xl bg-secondary/50 border border-border">
            <span className="text-muted-foreground">Cambio a entregar:</span>
            <span className={cn(
              "font-black text-3xl",
              amountReceived === "" ? "text-muted-foreground" :
              changeAmount >= 0 ? "text-green-500" : "text-destructive"
            )}>
              ${amountReceived === "" ? "0.00" : changeAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShow(false)} className="border-border">
            Cancelar
          </Button>
          <Button 
            onClick={() => finalizeOrder(changeAmount)} 
            disabled={!canConfirmCash}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold"
          >
            Completar Pago ↵
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
