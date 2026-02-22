import type { MenuItem } from "./menu_types";
import { burgerCustomizations } from "./menu_customizations";

export const burgerItems: MenuItem[] = [
  {
    id: "b1",
    name: "Hamburguesa Clásica",
    description: "Carne 100% res, queso amarillo, jamón, verdura y aderezos. Incluye papas a la francesa.",
    price: 65,
    category: "burgers",
    image: "🍔",
    customizations: burgerCustomizations,
  },
  {
    id: "b2",
    name: "Hamburguesa Asadera",
    description: "Carne 100% res, queso amarillo, salchicha para asar, queso blanco, cebolla asada, verdura y aderezos. Incluye papas.",
    price: 70,
    category: "burgers",
    image: "🍔",
    customizations: burgerCustomizations,
  },
  {
    id: "b3",
    name: "Hamburguesa BBQ",
    description: "Carne 100% res con salsa BBQ casera, queso blanco, jamón, tocino crujiente, cebolla caramelizada, verdura, aderezos. Incluye papas.",
    price: 70,
    category: "burgers",
    image: "🍔",
    customizations: burgerCustomizations,
  },
  {
    id: "b4",
    name: "Hamburguesa Tocinera",
    description: "Carne 100% res, queso blanco, queso amarillo, tocino crujiente, jamón, verdura, aderezos. Incluye papas.",
    price: 70,
    category: "burgers",
    image: "🍔",
    customizations: burgerCustomizations,
  },
  {
    id: "b5",
    name: "Hamburguesa Hawaiana",
    description: "Carne 100% res, piña, jamón, queso blanco, queso amarillo, verdura y aderezos. Incluye papas.",
    price: 70,
    category: "burgers",
    image: "🍔",
    customizations: burgerCustomizations,
  },
];
