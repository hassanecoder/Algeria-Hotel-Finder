import { Link, useLocation } from "wouter";
import { Menu, X, Hotel, MapPin, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/hotels", label: "Hotels", icon: Hotel },
    { href: "/cities", label: "Destinations", icon: MapPin },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
        isScrolled || !isHome
          ? "bg-background/95 backdrop-blur-md border-border/50 shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="Algeria Hotels" 
                className="w-6 h-6 object-contain invert"
              />
            </div>
            <span className={cn(
              "font-display text-xl font-bold tracking-tight transition-colors",
              !isScrolled && isHome ? "text-white" : "text-foreground"
            )}>
              Algeria Hotels
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative group",
                  !isScrolled && isHome ? "text-white/90 hover:text-white" : "text-muted-foreground hover:text-primary",
                  location.startsWith(link.href) && (!isHome || isScrolled) && "text-primary"
                )}
              >
                {link.label}
                {location.startsWith(link.href) && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 inset-x-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/hotels" 
              className={cn(
                "px-5 py-2.5 rounded-full font-medium transition-all duration-300",
                !isScrolled && isHome 
                  ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              )}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              !isScrolled && isHome ? "text-white" : "text-foreground"
            )}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <nav className="flex flex-col px-4 py-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground font-medium hover:bg-muted/50 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-primary" />
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-2">
                <Link 
                  href="/hotels"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Book Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
