import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/coaches", label: "Coaches" },
  { href: "/sessions", label: "Sessions" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "Admin":
        return "/admin";
      case "Coach":
        return "/coach";
      case "Member":
        return "/member";
      default:
        return "/";
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-transparent backdrop-blur-md border-b border-white/10"
          : "bg-black/80 backdrop-blur-sm border-b border-white/20"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className="relative">
              <div
                className={cn(
                  "absolute inset-0 blur-xl rounded-full transition-all duration-500",
                  scrolled ? "bg-primary/10" : "bg-primary/20"
                )}
              />
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="The Savage"
                className="w-12 h-12 object-contain relative z-10 transition-transform group-hover:scale-110"
              />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              The Savage
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                  location.pathname === link.href
                    ? "bg-white/20 text-white backdrop-blur-sm"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <span className="relative z-10">{link.label}</span>
                {location.pathname === link.href && (
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-20 blur-xl" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="gap-2 rounded-full px-5 transition-all bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[120px] truncate font-medium">{user?.fullName}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role !== 'Client' && (
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="w-full cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="secondary"
                  asChild
                  className="rounded-full px-6 bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {isAuthenticated ? (
                <>
                  {user?.role !== 'Client' && (
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-white/10 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium bg-primary text-white text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
