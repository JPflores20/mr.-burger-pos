import { Beef, Cookie } from "lucide-react";
import type { Category } from "@/data/menu";

export const categoryIcons: Record<Category, React.ElementType> = {
  burgers: Beef,
  combos: Beef,
  sides: Cookie,
  drinks: Cookie,
  desserts: Cookie,
};

export const categoryLabels: Record<Category, string> = {
  burgers: "Hamburguesas",
  combos: "Combos",
  sides: "Complementos",
  drinks: "Bebidas",
  desserts: "Postres",
};

export const allCategories: Category[] = ["burgers", "sides"];
