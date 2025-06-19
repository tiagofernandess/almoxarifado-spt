import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Sellers from "./pages/Sellers";
import Checkout from "./pages/Checkout";
import Return from "./pages/Return";
import Labels from "./pages/Labels";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout title="Dashboard">
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/items" element={
                <ProtectedRoute>
                  <Layout title="Itens">
                    <Items />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/sellers" element={
                <ProtectedRoute>
                  <Layout title="Vendedores">
                    <Sellers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Layout title="Saída de Itens">
                    <Checkout />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/return" element={
                <ProtectedRoute>
                  <Layout title="Devolução de Itens">
                    <Return />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/labels" element={
                <ProtectedRoute>
                  <Layout title="Geração de Etiquetas">
                    <Labels />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout title="Relatórios">
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute>
                  <Layout title="Usuários">
                    <Users />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
