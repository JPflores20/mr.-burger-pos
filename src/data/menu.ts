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
  price: number;
  category: Category;
  image: string;
  customizations: CustomizationOption[];
}

const burgerCustomizations: CustomizationOption[] = [
  { id: "no-onions", label: "No Onions", type: "remove", price: 0 },
  { id: "no-pickles", label: "No Pickles", type: "remove", price: 0 },
  { id: "no-tomato", label: "No Tomato", type: "remove", price: 0 },
  { id: "extra-cheese", label: "+ Extra Cheese", type: "add", price: 15 },
  { id: "extra-patty", label: "+ Extra Patty", type: "add", price: 35 },
  { id: "bacon", label: "+ Bacon", type: "add", price: 20 },
  { id: "jalapeños", label: "+ Jalapeños", type: "add", price: 10 },
];

const comboUpgrades: CustomizationOption[] = [
  ...burgerCustomizations,
  { id: "large-fries", label: "Large Fries Upgrade", type: "upgrade", price: 15 },
  { id: "large-drink", label: "Large Drink Upgrade", type: "upgrade", price: 10 },
];

const sidesCustomizations: CustomizationOption[] = [
  { id: "extra-sauce", label: "+ Extra Sauce", type: "add", price: 5 },
  { id: "cheese-sauce", label: "+ Cheese Sauce", type: "add", price: 10 },
  { id: "size-large", label: "Large Size", type: "upgrade", price: 15 },
];

const drinkCustomizations: CustomizationOption[] = [
  { id: "no-ice", label: "No Ice", type: "remove", price: 0 },
  { id: "extra-ice", label: "Extra Ice", type: "remove", price: 0 },
  { id: "size-large", label: "Large Size", type: "upgrade", price: 12 },
];

const dessertCustomizations: CustomizationOption[] = [
  { id: "extra-topping", label: "+ Extra Topping", type: "add", price: 10 },
  { id: "whipped-cream", label: "+ Whipped Cream", type: "add", price: 8 },
];

export const menuItems: MenuItem[] = [
  // Burgers
  { id: "b1", name: "Classic Burger", price: 89, category: "burgers", image: "🍔", customizations: burgerCustomizations },
  { id: "b2", name: "Double Smash", price: 119, category: "burgers", image: "🍔", customizations: burgerCustomizations },
  { id: "b3", name: "BBQ Bacon Burger", price: 129, category: "burgers", image: "🍔", customizations: burgerCustomizations },
  { id: "b4", name: "Mushroom Swiss", price: 115, category: "burgers", image: "🍔", customizations: burgerCustomizations },
  { id: "b5", name: "Spicy Jalapeño", price: 109, category: "burgers", image: "🍔", customizations: burgerCustomizations },
  { id: "b6", name: "Veggie Burger", price: 95, category: "burgers", image: "🍔", customizations: burgerCustomizations },
  { id: "b7", name: "Mr. Burger Deluxe", price: 149, category: "burgers", image: "🍔", customizations: burgerCustomizations },
  { id: "b8", name: "Chicken Burger", price: 99, category: "burgers", image: "🍔", customizations: burgerCustomizations },

  // Combos
  { id: "c1", name: "Classic Combo", price: 139, category: "combos", image: "🍟", customizations: comboUpgrades },
  { id: "c2", name: "Double Combo", price: 169, category: "combos", image: "🍟", customizations: comboUpgrades },
  { id: "c3", name: "BBQ Combo", price: 179, category: "combos", image: "🍟", customizations: comboUpgrades },
  { id: "c4", name: "Family Pack (4)", price: 449, category: "combos", image: "🍟", customizations: comboUpgrades },
  { id: "c5", name: "Kids Combo", price: 89, category: "combos", image: "🍟", customizations: comboUpgrades },
  { id: "c6", name: "Deluxe Combo", price: 199, category: "combos", image: "🍟", customizations: comboUpgrades },

  // Sides
  { id: "s1", name: "French Fries", price: 45, category: "sides", image: "🍟", customizations: sidesCustomizations },
  { id: "s2", name: "Onion Rings", price: 55, category: "sides", image: "🧅", customizations: sidesCustomizations },
  { id: "s3", name: "Chicken Nuggets", price: 65, category: "sides", image: "🍗", customizations: sidesCustomizations },
  { id: "s4", name: "Mozzarella Sticks", price: 60, category: "sides", image: "🧀", customizations: sidesCustomizations },
  { id: "s5", name: "Coleslaw", price: 35, category: "sides", image: "🥗", customizations: sidesCustomizations },
  { id: "s6", name: "Loaded Nachos", price: 75, category: "sides", image: "🌮", customizations: sidesCustomizations },

  // Drinks
  { id: "d1", name: "Coca-Cola", price: 35, category: "drinks", image: "🥤", customizations: drinkCustomizations },
  { id: "d2", name: "Sprite", price: 35, category: "drinks", image: "🥤", customizations: drinkCustomizations },
  { id: "d3", name: "Orange Juice", price: 40, category: "drinks", image: "🧃", customizations: drinkCustomizations },
  { id: "d4", name: "Iced Tea", price: 38, category: "drinks", image: "🧊", customizations: drinkCustomizations },
  { id: "d5", name: "Milkshake", price: 65, category: "drinks", image: "🥛", customizations: drinkCustomizations },
  { id: "d6", name: "Water", price: 20, category: "drinks", image: "💧", customizations: drinkCustomizations },

  // Desserts
  { id: "de1", name: "Chocolate Sundae", price: 55, category: "desserts", image: "🍨", customizations: dessertCustomizations },
  { id: "de2", name: "Apple Pie", price: 45, category: "desserts", image: "🥧", customizations: dessertCustomizations },
  { id: "de3", name: "Brownie", price: 50, category: "desserts", image: "🍫", customizations: dessertCustomizations },
  { id: "de4", name: "Ice Cream Cone", price: 35, category: "desserts", image: "🍦", customizations: dessertCustomizations },
  { id: "de5", name: "Churros", price: 40, category: "desserts", image: "🍩", customizations: dessertCustomizations },
];

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "burgers", label: "Burgers", icon: "beef" },
  { id: "combos", label: "Combos", icon: "package" },
  { id: "sides", label: "Sides", icon: "french-fries" },
  { id: "drinks", label: "Drinks", icon: "cup-soda" },
  { id: "desserts", label: "Desserts", icon: "ice-cream-cone" },
];
