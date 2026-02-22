import { useState } from "react";
import { ReceiptText, ChefHat, LogOut, Users } from "lucide-react";
import type { Category } from "@/data/menu";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth_context";
import { categoryIcons, categoryLabels, allCategories } from "./category_config";
import CashierManagementModal from "./cashier_management_modal";

interface Props {
  active: Category;
  onSelect: (c: Category) => void;
  onOpenOrders: () => void;
}

export default function CategorySidebar({ active, onSelect, onOpenOrders }: Props) {
  const navigate = useNavigate();
  const { logout, isCashier, isAdmin, currentUser } = useAuth();
  const [cashiersOpen, setCashiersOpen] = useState(false);
  const userInitial = (currentUser?.displayName ?? currentUser?.email ?? "U").charAt(0).toUpperCase();
  const userRole = isAdmin ? "Admin" : isCashier ? "Cajero" : "Usuario";

  return (
    <>
      <aside className="flex h-screen w-24 flex-col items-center border-r border-border bg-card py-4 gap-1">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-lg">
          MR
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {allCategories.map((cat) => {
            const Icon = categoryIcons[cat];
            const isActive = active === cat;

            return (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className={cn(
                  "flex w-20 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors",
                  isActive
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
          <button
            onClick={() => navigate("/cocina")}
            className="flex w-20 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors text-muted-foreground hover:bg-orange-500/10 hover:text-orange-600"
          >
            <ChefHat size={22} />
            Cocina
          </button>
          {isAdmin && (
            <button
              onClick={onOpenOrders}
              className="flex w-20 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <ReceiptText size={22} />
              Ventas
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setCashiersOpen(true)}
              className="flex w-20 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors text-muted-foreground hover:bg-primary/10 hover:text-primary"
            >
              <Users size={22} />
              Cajeros
            </button>
          )}
          <div className="flex flex-col items-center gap-1 py-2 border-t border-border w-full mt-2 pt-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shadow-md">
              {userInitial}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{userRole}</span>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="flex w-20 flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={22} />
            Salir
          </button>
        </div>
      </aside>

      <CashierManagementModal open={cashiersOpen} onClose={() => setCashiersOpen(false)} />
    </>
  );
}
