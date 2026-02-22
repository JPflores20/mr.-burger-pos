import type { MenuItem } from "./menu_types";
import { drinkCustomizations } from "./menu_customizations";

export const drinkItems: MenuItem[] = [
  {
    id: "d1",
    name: "Coca-Cola",
    price: 35,
    category: "drinks",
    image: "🥤",
    customizations: drinkCustomizations,
  },
  {
    id: "d2",
    name: "Sprite",
    price: 35,
    category: "drinks",
    image: "🥤",
    customizations: drinkCustomizations,
  },
  {
    id: "d3",
    name: "Jugo de Naranja",
    price: 40,
    category: "drinks",
    image: "🧃",
    customizations: drinkCustomizations,
  },
  {
    id: "d4",
    name: "Té Helado",
    price: 38,
    category: "drinks",
    image: "🧊",
    customizations: drinkCustomizations,
  },
  {
    id: "d5",
    name: "Malteada",
    price: 65,
    category: "drinks",
    image: "🥛",
    customizations: drinkCustomizations,
  },
  {
    id: "d6",
    name: "Agua",
    price: 20,
    category: "drinks",
    image: "💧",
    customizations: drinkCustomizations,
  },
];
