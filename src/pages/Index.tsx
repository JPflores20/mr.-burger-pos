import { useState, useRef, useEffect } from "react";
import CategorySidebar from "@/components/pos/CategorySidebar";
import ProductGrid from "@/components/pos/ProductGrid";
import OrderPanel from "@/components/pos/OrderPanel";
import CustomizationModal from "@/components/pos/CustomizationModal";
import OrdersHistoryModal from "@/components/pos/OrdersHistoryModal";
import type { Category, MenuItem } from "@/data/menu";

const Index = () => {
  const [category, setCategory] = useState<Category>("burgers");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CategorySidebar active={category} onSelect={(c) => { setCategory(c); setSearch(""); }} onOpenOrders={() => setOrdersModalOpen(true)} />
      <ProductGrid
        category={category}
        searchQuery={search}
        onSearchChange={setSearch}
        onSelectProduct={handleSelectProduct}
        searchRef={searchRef}
      />
      <OrderPanel />
      <CustomizationModal item={selectedItem} open={modalOpen} onClose={() => setModalOpen(false)} />
      <OrdersHistoryModal open={ordersModalOpen} onClose={() => setOrdersModalOpen(false)} />
    </div>
  );
};

export default Index;
