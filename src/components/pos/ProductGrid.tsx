import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { MenuItem, Category } from "@/data/menu";
import { menuItems } from "@/data/menu";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Props {
  category: Category;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProduct: (item: MenuItem) => void;
  searchRef: React.RefObject<HTMLInputElement>;
}

export default function ProductGrid({ category, searchQuery, onSearchChange, onSelectProduct, searchRef }: Props) {
  const filtered = menuItems.filter((item) => {
    const matchesCategory = item.category === category;
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return searchQuery ? matchesSearch : matchesCategory;
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Search Bar */}
      <div className="border-b border-border px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            ref={searchRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar productos... (F2)"
            className="pl-10 bg-secondary border-none text-foreground placeholder:text-muted-foreground h-10"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className={cn(
                "group flex flex-col items-center rounded-xl border border-border bg-card p-4 transition-all",
                "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]",
                "active:scale-[0.98]"
              )}
            >
              <span className="text-4xl mb-2">{item.image}</span>
              <span className="text-sm font-medium text-foreground text-center leading-tight">{item.name}</span>
              {item.description && (
                <span className="text-[10px] text-muted-foreground text-center mt-1 leading-snug line-clamp-2">
                  {item.description}
                </span>
              )}
              <span className="mt-1 text-base font-bold text-primary">${item.price.toFixed(2)}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No se encontraron productos
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
