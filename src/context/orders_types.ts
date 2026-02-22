import type { CartItem } from "./cart_context";

export interface Order {
  id: string;
  orderNumber: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashierName?: string;
  customerName?: string | null;
  orderType: "local" | "para-llevar" | "plataformas";
  timestamp: Date;
  status: "pending" | "completed";
}

export interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "timestamp" | "status" | "orderNumber">) => Order;
  removeOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: "pending" | "completed") => void;
  clearOrders: () => void;
  dailyTotal: number;
}
