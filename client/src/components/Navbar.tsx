import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Zap, LogIn, Menu, X, LogOut, Trophy } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const { user, loading: isLoading, signInWithGoogle, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navLinks = [
    { name: "The Arena", path: "/arena", icon: Zap },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-md">
      <div className="px-4 md:px-10 py-4 flex items-center justify-between max-w-[1280px] mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <img
            src="/cabe-logo.png"
            alt="CaBE Logo"
            className="h-8 w-auto object-contain transition-all group-hover:scale-105"
          />
          <h2 className="text-white text-xl font-bold tracking-tight">Arena</h2>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <span className={`
                  flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer
                  ${isActive(link.path)
                    ? "text-white"
                    : "text-slate-300 hover:text-white"}
                `}>
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-border-dark pl-8">
            {isLoading ? (
              <div className="w-20 h-8 bg-slate-800/50 rounded animate-pulse" />
            ) : user ? (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-white">{user.username || user.displayName}</span>
                  <span className="text-xs text-primary font-mono">{user.points || 0} XP</span>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.username || "User"} className="w-8 h-8 rounded-full border border-primary/50" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
                    {(user.username || user.displayName || "U")[0].toUpperCase()}
                  </div>
                )}
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <span className="text-white text-sm font-medium cursor-pointer">Sign In</span>
                </Link>
                <button
                  onClick={signInWithGoogle}
                  className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Start Your Climb
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-dark border-b border-border-dark overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path} onClick={() => setIsOpen(false)}>
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                    ${isActive(link.path) ? "bg-primary/10 text-primary" : "text-slate-300 hover:bg-slate-800/50 hover:text-white"}
                  `}>
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </div>
                </Link>
              ))}
              {!user && !isLoading && (
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    signInWithGoogle();
                  }}
                  className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
