import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Shield, LayoutDashboard, Zap, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { user, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;
  
  const navLinks = [
    { name: "Arena", path: "/arena", icon: Zap },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.8)] transition-all">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              CaBE <span className="text-secondary">Arena</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} className={`
                flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer
                ${isActive(link.path) 
                  ? "text-secondary shadow-[0_1px_0_0_currentColor]" 
                  : "text-muted-foreground hover:text-white"}
              `}>
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}

            {isLoading ? (
              <div className="w-20 h-8 bg-muted/50 rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3 pl-6 border-l border-border/50">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-white">{user.username}</span>
                  <span className="text-xs text-secondary font-mono">{user.points} XP</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <a 
                href="/api/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all font-medium text-sm"
              >
                <LogIn className="w-4 h-4" />
                Login
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border/50 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path} onClick={() => setIsOpen(false)}>
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                    ${isActive(link.path) ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:bg-muted/50 hover:text-white"}
                  `}>
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </div>
                </Link>
              ))}
              {!user && !isLoading && (
                <a 
                  href="/api/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-primary/10"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
