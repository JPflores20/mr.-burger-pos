import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { CustomizationOption, Category } from "@/data/menu";

export interface CartItem {
  cartId: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  customizations: CustomizationOption[];
  image: string;
  category: Category;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; cartId: string }
  | { type: "UPDATE_QTY"; cartId: string; delta: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return { items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.cartId !== action.cartId) };
    case "UPDATE_QTY": {
      return {
        items: state.items
          .map((i) =>
            i.cartId === action.cartId
              ? { ...i, quantity: Math.max(0, i.quantity + action.delta) }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = useCallback((item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }), []);
  const removeItem = useCallback((cartId: string) => dispatch({ type: "REMOVE_ITEM", cartId }), []);
  const updateQuantity = useCallback((cartId: string, delta: number) => dispatch({ type: "UPDATE_QTY", cartId, delta }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const subtotal = state.items.reduce((sum, item) => {
    const customPrice = item.customizations.reduce((s, c) => s + c.price, 0);
    return sum + (item.basePrice + customPrice) * item.quantity;
  }, 0);

  const tax = 0;
  const total = subtotal;

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, subtotal, tax, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
