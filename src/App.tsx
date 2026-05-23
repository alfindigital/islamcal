import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/zakat" element={<Index />} />
          <Route path="/waris" element={<Index />} />
          <Route path="/biaya-haji" element={<Index />} />
          <Route path="/tabungan-haji" element={<Index />} />
          <Route path="/qurban" element={<Index />} />
          <Route path="/aqiqah" element={<Index />} />
          <Route path="/dzikir" element={<Index />} />
          <Route path="/kalender-hijriyah" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
