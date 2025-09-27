import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, User, Menu, X, Info, Wallet, LogOut, Shield } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isConnected, account, isLoading, error, connect, disconnect } = useWallet();
  const { toast } = useToast();
  const { user } = useUser();
  
  // Check if user is admin
  const isAdmin = user?.organizationMemberships?.some(
    (membership) => membership.organization.name === "AgriRisk" && 
    membership.role === "admin"
  ) || (user && import.meta.env.DEV); // Allow any signed-in user in development

  const isActive = (path: string) => location.pathname === path;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connect();
      if (isConnected) {
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast({
        title: "Disconnect Error",
        description: "There was an issue disconnecting your wallet.",
        variant: "destructive",
      });
    }
  };

  // Show error toast when wallet error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: "Wallet Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const navItems = [
    { path: "/", label: "Home", icon: TrendingUp },
    { path: "/markets", label: "Markets", icon: Activity },
    { path: "/portfolio", label: "Portfolio", icon: User },
    { path: "/about", label: "About", icon: Info },
    ...(isAdmin ? [{ path: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <nav className="bg-card/95 border-b border-card-border sticky top-0 z-50 backdrop-blur-sm">
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
          <div className="hidden md:flex items-center space-x-2">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="hero" size="sm" className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>{formatAddress(account!)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="hero" 
                size="sm" 
                onClick={handleConnect}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </Button>
            )}
           
            {/* Clerk auth */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-card border border-card-border shadow-lg",
                    userButtonPopoverActionButton: "hover:bg-accent",
                    userButtonPopoverActionButtonText: "text-foreground",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </SignedIn>
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
              {isConnected ? (
                <div className="w-full mt-4 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-card border border-card-border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{formatAddress(account!)}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-red-600">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="hero" 
                  className="w-full mt-4"
                  onClick={handleConnect}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
              
              {/* Mobile Clerk auth */}
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full mt-2 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="w-full mt-2 flex justify-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "bg-card border border-card-border shadow-lg",
                        userButtonPopoverActionButton: "hover:bg-accent",
                        userButtonPopoverActionButtonText: "text-foreground",
                        userButtonPopoverFooter: "hidden"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;