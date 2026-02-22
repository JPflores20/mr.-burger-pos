import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/cart_context";
import { OrdersProvider } from "@/context/orders_context";
import { AuthProvider } from "@/context/auth_context";
import { AdminProvider } from "@/context/admin_context";
import { ProtectedRoute } from "@/components/auth/protected_route";
import Index from "./pages/index";
import NotFound from "./pages/not_found";
import KitchenView from "./pages/kitchen_view";
import AdminDashboard from "./pages/admin_dashboard";
import Login from "./pages/login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
      <AdminProvider>
      <CartProvider>
        <OrdersProvider>
          <Toaster />
          <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/cocina" element={<ProtectedRoute allowCashier={true}><KitchenView /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
        </OrdersProvider>
      </CartProvider>
      </AdminProvider>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
