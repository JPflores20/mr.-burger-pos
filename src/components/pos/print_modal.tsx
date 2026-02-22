import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle } from "lucide-react";

interface Props {
  show: boolean;
  closePrintModal: () => void;
  handlePrint: () => void;
}

export function PrintModal({ show, closePrintModal, handlePrint }: Props) {
  return (
    <Dialog open={show} onOpenChange={(open) => !open && closePrintModal()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </DialogTitle>
          <DialogTitle className="text-2xl text-center">¡Venta Exitosa!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            ¿Deseas imprimir el ticket para el cliente?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-center mt-6">
          <Button variant="outline" onClick={closePrintModal} className="w-full sm:w-auto h-12 text-muted-foreground border-border">
            Nueva Venta
          </Button>
          <Button onClick={handlePrint} className="w-full sm:w-auto h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8">
            <Printer className="mr-2" size={20} />
            Imprimir Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
