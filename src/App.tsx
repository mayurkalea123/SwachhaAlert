import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import AIChatWidget from "@/components/features/AIChatWidget";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportGarbage from "./pages/ReportGarbage";
import MyReports from "./pages/MyReports";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminDispatches from "./pages/AdminDispatches";

const queryClient = new QueryClient();

// Global AI widget — hidden on /report (that page has its own with form-fill)
function GlobalAIWidget() {
  const location = useLocation();
  if (location.pathname === '/report') return null;
  return <AIChatWidget />;
}

function AppRoutes() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <GlobalAIWidget />

      <Routes>
        <Route path="/" element={
          <>
            {user && <Navbar user={user} onLogout={logout} />}
            <Index />
          </>
        } />

        <Route path="/login" element={
          user ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace /> : <Auth mode="login" />
        } />
        <Route path="/register" element={
          user ? <Navigate to="/dashboard" replace /> : <Auth mode="register" />
        } />

        {/* Citizen */}
        <Route path="/dashboard" element={
          !user ? <Navigate to="/login" replace /> :
          isAdmin ? <Navigate to="/admin" replace /> :
          <><Navbar user={user} onLogout={logout} /><CitizenDashboard /></>
        } />
        <Route path="/report" element={
          !user ? <Navigate to="/login" replace /> :
          <><Navbar user={user} onLogout={logout} /><ReportGarbage /></>
        } />
        <Route path="/my-reports" element={
          !user ? <Navigate to="/login" replace /> :
          <><Navbar user={user} onLogout={logout} /><MyReports /></>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          !user ? <Navigate to="/login" replace /> :
          !isAdmin ? <Navigate to="/dashboard" replace /> :
          <><Navbar user={user} onLogout={logout} /><AdminDashboard /></>
        } />
        <Route path="/admin/reports" element={
          !user ? <Navigate to="/login" replace /> :
          !isAdmin ? <Navigate to="/dashboard" replace /> :
          <><Navbar user={user} onLogout={logout} /><AdminReports /></>
        } />
        <Route path="/admin/dispatches" element={
          !user ? <Navigate to="/login" replace /> :
          !isAdmin ? <Navigate to="/dashboard" replace /> :
          <><Navbar user={user} onLogout={logout} /><AdminDispatches /></>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
