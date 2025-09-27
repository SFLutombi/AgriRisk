import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, User, Menu, X, Info } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: TrendingUp },
    { path: "/markets", label: "Markets", icon: Activity },
    { path: "/portfolio", label: "Portfolio", icon: User },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="bg-card border-b border-card-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient-hero">AgriRisk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? "soft" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex">
            <Button variant="hero" size="sm">
              Connect Wallet
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant={isActive(path) ? "soft" : "ghost"}
                    className="w-full justify-start space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Button>
                </Link>
              ))}
              <Button variant="hero" className="w-full mt-4">
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;