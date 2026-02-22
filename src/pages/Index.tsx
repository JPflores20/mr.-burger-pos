import { useState, useRef, useEffect } from "react";
import CategorySidebar from "@/components/pos/category_sidebar";
import ProductGrid from "@/components/pos/product_grid";
import OrderPanel from "@/components/pos/order_panel";
import CustomizationModal from "@/components/pos/customization_modal";
import OrdersHistoryModal from "@/components/pos/orders_history_modal";
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

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CategorySidebar active={category} onSelect={(category) => { setCategory(category); setSearch(""); }} onOpenOrders={() => setOrdersModalOpen(true)} />
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
