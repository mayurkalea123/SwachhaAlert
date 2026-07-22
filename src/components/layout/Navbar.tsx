import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, X, Leaf, ChevronDown, User, LayoutDashboard, FileText, Truck, Bot } from 'lucide-react';
import { User as UserType } from '@/types';
import { getStoredNotifications } from '@/lib/store';
import NotificationPanel from '@/components/features/NotificationPanel';

interface NavbarProps {
  user: UserType | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const notifications = getStoredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const citizenLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/report', label: 'Report Garbage', icon: FileText },
    { href: '/my-reports', label: 'My Reports', icon: Truck },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/reports', label: 'All Reports', icon: FileText },
    { href: '/admin/dispatches', label: 'Dispatches', icon: Truck },
  ];

  const links = user?.role === 'admin' ? adminLinks : citizenLinks;

  const handleClose = () => {
    setShowNotifs(false);
    setShowUserMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-lg text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Swachha</span>
              <span className="font-bold text-lg text-[hsl(158,64%,32%)]" style={{ fontFamily: 'Sora, sans-serif' }}>Alert</span>
              {user?.role === 'admin' && (
                <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold tracking-wide">ADMIN</span>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === href
                      ? 'gradient-brand text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
                    className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-12 w-52 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden slide-in-up">
                      <div className="px-4 py-3 bg-emerald-50 border-b border-border">
                        <p className="font-bold text-sm text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold capitalize">{user.role}</span>
                      </div>
                      {user.ward && (
                        <div className="px-4 py-2 border-b border-border/50">
                          <p className="text-xs text-muted-foreground">Ward: <span className="text-foreground font-medium">{user.ward}</span></p>
                        </div>
                      )}
                      <button
                        onClick={() => { onLogout(); handleClose(); navigate('/'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 gradient-brand text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {user && mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1 shadow-sm">
          <div className="pb-2 mb-2 border-b border-border/60">
            <p className="text-xs text-muted-foreground font-medium px-2">Signed in as <span className="text-foreground font-semibold">{user.name}</span></p>
          </div>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === href
                  ? 'gradient-brand text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <button
            onClick={() => { onLogout(); setMobileOpen(false); navigate('/'); }}
            className="w-full flex items-center gap-2.5 px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
