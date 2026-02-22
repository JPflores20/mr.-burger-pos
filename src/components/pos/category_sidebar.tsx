import { ReceiptText, ChefHat, LogOut } from "lucide-react";
import type { Category } from "@/data/menu";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth_context";
import { categoryIcons, categoryLabels, allCategories } from "./category_config";

interface Props {
  active: Category;
  onSelect: (c: Category) => void;
  onOpenOrders: () => void;
}

export default function CategorySidebar({ active, onSelect, onOpenOrders }: Props) {
  const navigate = useNavigate();
  const { logout, isCashier, isAdmin } = useAuth();
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

      <div className="mt-auto flex flex-col items-center gap-2 mb-4">
        {!isCashier && (
          <button
            onClick={() => navigate("/cocina")}
            className="flex w-16 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors text-muted-foreground hover:bg-orange-500/10 hover:text-orange-600"
          >
            <ChefHat size={22} />
            Cocina
          </button>
        )}
        {logout && isAdmin && (
          <button
            onClick={onOpenOrders}
            className="flex w-16 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ReceiptText size={22} />
            Ventas
          </button>
        )}
        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="flex w-16 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-4"
        >
          <LogOut size={22} />
          Salir
        </button>
      </div>
    </aside>
  );
}
