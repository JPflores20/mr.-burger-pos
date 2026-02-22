import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartContext";
import type { MenuItem, CustomizationOption } from "@/data/menu";
import { cn } from "@/lib/utils";

interface Props {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

export default function CustomizationModal({ item, open, onClose }: Props) {
  const [selected, setSelected] = useState<CustomizationOption[]>([]);
  const { addItem } = useCart();

  // Reset on open
  useEffect(() => {
    if (open) setSelected([]);
  }, [open, item]);

  const toggle = (opt: CustomizationOption) => {
    setSelected((prev) =>
      prev.find((o) => o.id === opt.id)
        ? prev.filter((o) => o.id !== opt.id)
        : [...prev, opt]
    );
  };

  const customPrice = selected.reduce((s, c) => s + c.price, 0);
  const totalPrice = (item?.price ?? 0) + customPrice;

  const handleAdd = useCallback(() => {
    if (!item) return;
    addItem({
      cartId: crypto.randomUUID(),
      menuItemId: item.id,
      name: item.name,
      basePrice: item.price,
      quantity: 1,
      customizations: selected,
      image: item.image,
    });
    onClose();
  }, [item, selected, addItem, onClose]);

  // Enter to confirm
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdd();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleAdd]);

  if (!item) return null;

  const removals = item.customizations.filter((c) => c.type === "remove");
  const adds = item.customizations.filter((c) => c.type === "add");
  const upgrades = item.customizations.filter((c) => c.type === "upgrade");

  const renderGroup = (title: string, options: CustomizationOption[]) => {
    if (options.length === 0) return null;
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
        {options.map((opt) => {
          const checked = !!selected.find((o) => o.id === opt.id);
          return (
            <label
              key={opt.id}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2.5 transition-colors",
                checked ? "border-primary bg-primary/10" : "hover:bg-secondary"
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox checked={checked} onCheckedChange={() => toggle(opt)} />
                <span className="text-sm font-medium">{opt.label}</span>
              </div>
              {opt.price > 0 && (
                <span className="text-sm font-semibold text-primary">+${opt.price.toFixed(2)}</span>
              )}
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg">
            <span className="text-3xl">{item.image}</span>
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-sm font-normal text-muted-foreground">Base: ${item.price.toFixed(2)}</div>
              {item.description && (
                <div className="text-xs font-normal text-muted-foreground mt-1 max-w-sm flex-1 leading-tight">
                  {item.description}
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {renderGroup("Quitar", removals)}
          {renderGroup("Agregar", adds)}
          {renderGroup("Mejorar", upgrades)}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
          <div className="text-lg font-bold text-foreground">
            Total: <span className="text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
            Agregar a la Orden ↵
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
