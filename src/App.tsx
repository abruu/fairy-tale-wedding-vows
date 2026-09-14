import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Routed pages are mutually exclusive, but both were statically imported —
// every visitor's initial bundle included GSAP/Lenis/Framer Motion and every
// component for BOTH pages regardless of which route they landed on. Lazy
// loading each page keeps a visitor's download limited to the page they're
// actually viewing.
const WeddingComingSoon = lazy(() => import("./coming-soon/pages/WeddingComingSoon"));
const WeddingV2 = lazy(() => import("./v2/pages/WeddingV2"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<WeddingComingSoon />} />
              <Route path="/main" element={<WeddingV2 />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
