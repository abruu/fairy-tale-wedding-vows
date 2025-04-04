
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import AOS animation library
const loadAOS = () => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
  script.async = true;
  script.onload = () => {
    // @ts-ignore
    if (window.AOS) window.AOS.init({ duration: 1000, once: false, offset: 120 });
  };
  document.body.appendChild(script);

  const link = document.createElement('link');
  link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    loadAOS();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
