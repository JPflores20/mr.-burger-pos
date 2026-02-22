import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/cart_context";
import type { MenuItem, CustomizationOption } from "@/data/menu";
import { CustomizationGroup } from "./customization_group";

interface Props {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

export default function CustomizationModal({ item, open, onClose }: Props) {
  const [selected, setSelected] = useState<CustomizationOption[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    if (open) setSelected([]);
  }, [open, item]);

  const toggle = (option: CustomizationOption) => {
    setSelected((previousSelected) =>
      previousSelected.find((selectedOption) => selectedOption.id === option.id)
        ? previousSelected.filter((selectedOption) => selectedOption.id !== option.id)
        : [...previousSelected, option]
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

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
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
          <DialogDescription className="sr-only">Selecciona las personalizaciones para {item.name}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          <CustomizationGroup title="Quitar" options={removals} selected={selected} toggle={toggle} />
          <CustomizationGroup title="Agregar" options={adds} selected={selected} toggle={toggle} />
          <CustomizationGroup title="Mejorar" options={upgrades} selected={selected} toggle={toggle} />
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
