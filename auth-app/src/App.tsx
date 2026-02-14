import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CallbackHandler from "./components/auth/CallbackHandler";
import TwoFactorPrompt from "./components/auth/TwoFactorPrompt";
import TwoFactorSetup from "./components/auth/TwoFactorSetup";
import CheckEmail from "./pages/CheckEmail";
import EmailConfirmed from "./pages/EmailConfirmed";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/auth">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/auth/callback" element={<CallbackHandler />} />
          <Route path="/auth/two-factor-prompt" element={<TwoFactorPrompt />} />
          <Route path="/auth/setup-2fa" element={<TwoFactorSetup />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
