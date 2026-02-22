import type { MenuItem } from "./menu_types";
import { comboUpgrades } from "./menu_customizations";

export const comboItems: MenuItem[] = [
  {
    id: "c1",
    name: "Combo Clásico",
    price: 139,
    category: "combos",
    image: "🍟",
    customizations: comboUpgrades,
  },
  {
    id: "c2",
    name: "Combo Doble",
    price: 169,
    category: "combos",
    image: "🍟",
    customizations: comboUpgrades,
  },
  {
    id: "c3",
    name: "Combo BBQ",
    price: 179,
    category: "combos",
    image: "🍟",
    customizations: comboUpgrades,
  },
  {
    id: "c4",
    name: "Paquete Familiar (4)",
    price: 449,
    category: "combos",
    image: "🍟",
    customizations: comboUpgrades,
  },
  {
    id: "c5",
    name: "Combo Infantil",
    price: 89,
    category: "combos",
    image: "🍟",
    customizations: comboUpgrades,
  },
  {
    id: "c6",
    name: "Combo Deluxe",
    price: 199,
    category: "combos",
    image: "🍟",
    customizations: comboUpgrades,
  },
];
