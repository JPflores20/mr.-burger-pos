export type { Category, CustomizationOption, MenuItem } from "./menu_types";

export {
  burgerCustomizations,
  comboUpgrades,
  sidesCustomizations,
  drinkCustomizations,
  dessertCustomizations,
} from "./menu_customizations";

import type { Category, MenuItem } from "./menu_types";
import { burgerItems } from "./menu_burgers";
import { comboItems } from "./menu_combos";
import { sideItems } from "./menu_sides";
import { drinkItems } from "./menu_drinks";
import { dessertItems } from "./menu_desserts";

export const menuItems: MenuItem[] = [
  ...burgerItems,
  ...comboItems,
  ...sideItems,
  ...drinkItems,
  ...dessertItems,
];

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "burgers", label: "Hamburguesas", icon: "beef" },
  { id: "combos", label: "Combos", icon: "package" },
  { id: "sides", label: "Complementos", icon: "french-fries" },
  { id: "drinks", label: "Bebidas", icon: "cup-soda" },
  { id: "desserts", label: "Postres", icon: "ice-cream-cone" },
];
