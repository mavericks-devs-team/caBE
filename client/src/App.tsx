import { Switch, Route } from "wouter";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Arena from "@/pages/Arena";
import TaskDetails from "@/pages/TaskDetails";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Admin from "@/pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/arena" component={Arena} />
      <Route path="/task/:id" component={TaskDetails} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Navbar />
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
