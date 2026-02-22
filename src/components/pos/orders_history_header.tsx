import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Receipt, DollarSign, CalendarDays } from "lucide-react";

interface Props {
  dailyTotal: number;
  ordersCount: number;
  onExportPDF: () => void;
}

export function OrdersHistoryHeader({ dailyTotal, ordersCount, onExportPDF }: Props) {
  return (
    <SheetHeader className="p-6 border-b border-border bg-secondary/30">
      <div className="flex justify-between items-start">
        <SheetTitle className="flex items-center gap-2 text-2xl font-black uppercase text-foreground">
          <Receipt className="text-primary" />
          Ventas del Día
        </SheetTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportPDF}
          className="border-primary text-primary hover:bg-primary/10"
          disabled={ordersCount === 0}
        >
          Exportar a PDF
        </Button>
      </div>
      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1 bg-background px-3 py-1.5 rounded-md border border-border">
          <CalendarDays size={16} />
          <span className="font-medium text-foreground">
            {new Date().toLocaleDateString("es-MX", { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-md font-bold">
          <DollarSign size={16} />
          <span>Total: ${dailyTotal.toFixed(2)}</span>
        </div>
      </div>
    </SheetHeader>
  );
}
