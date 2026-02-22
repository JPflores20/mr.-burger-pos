import type { MenuItem } from "./menu_types";
import { dessertCustomizations } from "./menu_customizations";

export const dessertItems: MenuItem[] = [
  {
    id: "de1",
    name: "Sundae de Chocolate",
    price: 55,
    category: "desserts",
    image: "🍨",
    customizations: dessertCustomizations,
  },
  {
    id: "de2",
    name: "Pay de Manzana",
    price: 45,
    category: "desserts",
    image: "🥧",
    customizations: dessertCustomizations,
  },
  {
    id: "de3",
    name: "Brownie",
    price: 50,
    category: "desserts",
    image: "🍫",
    customizations: dessertCustomizations,
  },
  {
    id: "de4",
    name: "Cono de Helado",
    price: 35,
    category: "desserts",
    image: "🍦",
    customizations: dessertCustomizations,
  },
  {
    id: "de5",
    name: "Churros",
    price: 40,
    category: "desserts",
    image: "🍩",
    customizations: dessertCustomizations,
  },
];
