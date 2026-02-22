export type Category = "burgers" | "combos" | "sides" | "drinks" | "desserts";

export interface CustomizationOption {
  id: string;
  label: string;
  type: "remove" | "add" | "upgrade";
  price: number; // 0 for removals
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: Category;
  image: string;
  customizations: CustomizationOption[];
}

const burgerCustomizations: CustomizationOption[] = [
  { id: "no-onions", label: "Sin Cebolla", type: "remove", price: 0 },
  { id: "no-pickles", label: "Sin Pepinillos", type: "remove", price: 0 },
  { id: "no-tomato", label: "Sin Tomate", type: "remove", price: 0 },
  { id: "extra-cheese", label: "+ Extra Queso", type: "add", price: 15 },
  { id: "extra-patty", label: "+ Extra Carne", type: "add", price: 35 },
  { id: "bacon", label: "+ Tocino", type: "add", price: 20 },
  { id: "jalapeños", label: "+ Jalapeños", type: "add", price: 10 },
];

const comboUpgrades: CustomizationOption[] = [
  ...burgerCustomizations,
  { id: "large-fries", label: "Agrandar Papas", type: "upgrade", price: 15 },
  { id: "large-drink", label: "Agrandar Bebida", type: "upgrade", price: 10 },
];

const sidesCustomizations: CustomizationOption[] = [
  { id: "extra-sauce", label: "+ Extra Salsa", type: "add", price: 5 },
  { id: "cheese-sauce", label: "+ Salsa de Queso", type: "add", price: 10 },
  { id: "size-large", label: "Tamaño Grande", type: "upgrade", price: 15 },
];

const drinkCustomizations: CustomizationOption[] = [
  { id: "no-ice", label: "Sin Hielo", type: "remove", price: 0 },
  { id: "extra-ice", label: "Extra Hielo", type: "remove", price: 0 },
  { id: "size-large", label: "Tamaño Grande", type: "upgrade", price: 12 },
];

const dessertCustomizations: CustomizationOption[] = [
  { id: "extra-topping", label: "+ Topping Extra", type: "add", price: 10 },
  { id: "whipped-cream", label: "+ Crema Batida", type: "add", price: 8 },
];

export const menuItems: MenuItem[] = [
  // Burgers
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

  // Combos
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

  // Sides
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
  // Drinks
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

  // Desserts
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

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "burgers", label: "Hamburguesas", icon: "beef" },
  { id: "combos", label: "Combos", icon: "package" },
  { id: "sides", label: "Complementos", icon: "french-fries" },
  { id: "drinks", label: "Bebidas", icon: "cup-soda" },
  { id: "desserts", label: "Postres", icon: "ice-cream-cone" },
];
