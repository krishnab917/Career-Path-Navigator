import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Simulations from "@/pages/simulations";
import SimulationDetail from "@/pages/simulation-detail";
import Simulate from "@/pages/simulate";
import Analysis from "@/pages/analysis";
import Opportunities from "@/pages/opportunities";
import Roadmap from "@/pages/roadmap";
import Layout from "@/components/layout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/simulate/:sessionId" component={Simulate} />
      
      <Route path="/dashboard"><Layout><Dashboard /></Layout></Route>
      <Route path="/simulations"><Layout><Simulations /></Layout></Route>
      <Route path="/simulations/:id"><Layout><SimulationDetail /></Layout></Route>
      <Route path="/analysis/:sessionId"><Layout><Analysis /></Layout></Route>
      <Route path="/opportunities"><Layout><Opportunities /></Layout></Route>
      <Route path="/roadmap"><Layout><Roadmap /></Layout></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="dark bg-background text-foreground min-h-[100dvh] w-full">
            <Router />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;