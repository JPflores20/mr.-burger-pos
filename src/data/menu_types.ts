export type Category = "burgers" | "combos" | "sides" | "drinks" | "desserts";

export interface CustomizationOption {
  id: string;
  label: string;
  type: "remove" | "add" | "upgrade";
  price: number;
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
