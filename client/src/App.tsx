import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Order from "@/pages/Order";
import Tracking from "@/pages/Tracking";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import UnderConstruction from "@/pages/UnderConstruction";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function Router() {
  const [location] = useLocation();
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  // Listen for maintenance mode changes via SSE and refresh page
  useEffect(() => {
    const eventSource = new EventSource("/api/maintenance-updates");
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Reload the entire page when maintenance status changes
        window.location.reload();
      } catch (err) {
        console.error("Error parsing SSE message:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Show under construction page if maintenance is ON, except for admin routes
  if (settings?.maintenanceMode && !location.startsWith("/admin")) {
    return <UnderConstruction />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/order" component={Order} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-[#0a0c10] font-sans antialiased selection:bg-primary selection:text-primary-foreground">
          <Navbar />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
