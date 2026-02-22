import { Beef, Package, CupSoda, IceCreamCone, Cookie, ReceiptText } from "lucide-react";
import type { Category } from "@/data/menu";
import { cn } from "@/lib/utils";

const categoryIcons: Record<Category, React.ElementType> = {
  burgers: Beef,
  combos: Package,
  sides: Cookie,
  drinks: CupSoda,
  desserts: IceCreamCone,
};

const categoryLabels: Record<Category, string> = {
  burgers: "Hamburguesas",
  combos: "Combos",
  sides: "Complementos",
  drinks: "Bebidas",
  desserts: "Postres",
};

const allCategories: Category[] = ["burgers", "sides", "combos", "drinks", "desserts"];

interface Props {
  active: Category;
  onSelect: (c: Category) => void;
  onOpenOrders: () => void;
}

export default function CategorySidebar({ active, onSelect, onOpenOrders }: Props) {
  return (
    <aside className="flex h-screen w-20 flex-col items-center border-r border-border bg-card py-4 gap-1">
      {/* Logo */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-lg">
        MR
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {allCategories.map((cat) => {
          const Icon = categoryIcons[cat];
          const isActive = active === cat;
          const isDisabled = cat === "combos" || cat === "drinks" || cat === "desserts";
          
          return (
            <button
              key={cat}
              onClick={() => !isDisabled && onSelect(cat)}
              disabled={isDisabled}
              className={cn(
                "flex w-16 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors",
                isDisabled 
                  ? "opacity-30 cursor-not-allowed grayscale"
                  : isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon size={22} />
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      <button
        onClick={onOpenOrders}
        className="mt-auto mb-4 flex w-16 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <ReceiptText size={22} />
        Ventas
      </button>
    </aside>
  );
}
