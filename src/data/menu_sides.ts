import type { MenuItem } from "./menu_types";
import { sidesCustomizations } from "./menu_customizations";

export const sideItems: MenuItem[] = [
  {
    id: "s0",
    name: "Orden de Papas a la Francesa",
    price: 40,
    category: "sides",
    image: "🍟",
    customizations: sidesCustomizations,
  },
  {
    id: "s1",
    name: "Papas Fritas (Porción Extra)",
    price: 45,
    category: "sides",
    image: "🍟",
    customizations: sidesCustomizations,
  },
];
