import type { CustomizationOption } from "./menu_types";

export const burgerCustomizations: CustomizationOption[] = [
  { id: "no-onions", label: "Sin Cebolla", type: "remove", price: 0 },
  { id: "no-pickles", label: "Sin Pepinillos", type: "remove", price: 0 },
  { id: "no-tomato", label: "Sin Tomate", type: "remove", price: 0 },
  { id: "extra-cheese", label: "+ Extra Queso", type: "add", price: 15 },
  { id: "extra-patty", label: "+ Extra Carne", type: "add", price: 35 },
  { id: "bacon", label: "+ Tocino", type: "add", price: 20 },
  { id: "jalapeños", label: "+ Jalapeños", type: "add", price: 10 },
];

export const comboUpgrades: CustomizationOption[] = [
  ...burgerCustomizations,
  { id: "large-fries", label: "Agrandar Papas", type: "upgrade", price: 15 },
  { id: "large-drink", label: "Agrandar Bebida", type: "upgrade", price: 10 },
];

export const sidesCustomizations: CustomizationOption[] = [
  { id: "extra-sauce", label: "+ Extra Salsa", type: "add", price: 5 },
  { id: "cheese-sauce", label: "+ Salsa de Queso", type: "add", price: 10 },
  { id: "size-large", label: "Tamaño Grande", type: "upgrade", price: 15 },
];

export const drinkCustomizations: CustomizationOption[] = [
  { id: "no-ice", label: "Sin Hielo", type: "remove", price: 0 },
  { id: "extra-ice", label: "Extra Hielo", type: "remove", price: 0 },
  { id: "size-large", label: "Tamaño Grande", type: "upgrade", price: 12 },
];

export const dessertCustomizations: CustomizationOption[] = [
  { id: "extra-topping", label: "+ Topping Extra", type: "add", price: 10 },
  { id: "whipped-cream", label: "+ Crema Batida", type: "add", price: 8 },
];
