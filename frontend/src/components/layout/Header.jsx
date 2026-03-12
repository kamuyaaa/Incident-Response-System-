import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
  Map,
  LayoutDashboard,
  LogOut,
  User,
  ListTodo,
  Bell,
  FileText,
  ClipboardList,
  LayoutGrid,
  Menu,
  X,
} from 'lucide-react';
import logoSvg from '../../assets/logo/logo-icon.svg?url';

const navItems = (role) => {
  const base = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/incidents', icon: ClipboardList, label: 'Incidents' },
    { to: '/map', icon: Map, label: 'Map' },
  ];
  if (role === 'RESPONDER') base.push({ to: '/assignments', icon: ListTodo, label: 'Assignments' });
  if (role === 'ADMIN' || role === 'SUPERVISOR') {
    base.push(
      { to: '/manage', icon: LayoutGrid, label: 'Manage' },
      { to: '/alerts', icon: Bell, label: 'Alerts' },
      { to: '/activity', icon: FileText, label: 'Activity' }
    );
  }
  return base;
};

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  const linkClass = (to) =>
    `flex items-center gap-3 w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl text-ers-inkSecondary hover:text-ers-ink hover:bg-ers-subtle/80 transition-colors touch-target min-h-[48px] sm:min-h-0 ${
      location.pathname === to ? 'bg-ers-subtle/80 text-ers-ink font-medium' : ''
    }`;

  return (
    <header className={`sticky top-0 z-sticky border-b transition-colors duration-200 ${
      isLanding ? 'bg-ers-bg/95 backdrop-blur-sm border-ers-subtle' : 'bg-ers-elevated/95 backdrop-blur-sm border-ers-subtle'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-ers-ink font-display font-semibold touch-target min-w-[44px] min-h-[44px] items-center justify-center -ml-2 sm:ml-0"
          aria-label="Kenya Emergency Response home"
        >
          <img src={logoSvg} alt="" className="w-8 h-10 sm:w-9 sm:h-[2.25rem] shrink-0 object-contain" />
          <span className="text-base sm:text-lg">Kenya Emergency Response</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {navItems(user?.role).map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className="p-2.5 rounded-xl text-ers-inkTertiary hover:text-ers-ink hover:bg-ers-subtle/80 transition-colors" title={label}>
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
              <div className="flex items-center gap-2 pl-3 ml-1 border-l border-ers-subtle">
                <span className="text-sm text-ers-inkSecondary max-w-[120px] truncate">{user?.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-ers-subtle/80 text-ers-inkTertiary font-medium">{user?.role}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="!p-2.5 !min-h-0">
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="!py-2 !px-4 !min-h-0 text-sm font-medium rounded-xl">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="!py-2 !px-4 !min-h-0 text-sm font-medium rounded-xl">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>

        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <span className="text-xs px-2 py-1 rounded-lg bg-ers-subtle/80 text-ers-inkTertiary font-medium truncate max-w-[80px]">{user?.role}</span>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="touch-target min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-ers-inkTertiary hover:text-ers-ink hover:bg-ers-subtle/80"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-ers-ink/20 backdrop-blur-sm z-overlay md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-ers-elevated border-l border-ers-subtle z-modal flex flex-col md:hidden shadow-ers-lg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="p-4 border-b border-ers-subtle flex items-center justify-between">
                <span className="font-display font-semibold text-ers-ink">Menu</span>
                <button type="button" onClick={() => setMobileOpen(false)} className="touch-target p-2 rounded-xl text-ers-inkTertiary hover:text-ers-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {isAuthenticated ? (
                  <>
                    {navItems(user?.role).map(({ to, icon: Icon, label }) => (
                      <Link key={to} to={to} onClick={() => setMobileOpen(false)} className={linkClass(to)}>
                        <Icon className="w-5 h-5 shrink-0" />
                        {label}
                      </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-ers-subtle flex items-center gap-3 px-4 py-2">
                      <User className="w-5 h-5 text-ers-inkTertiary" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ers-ink truncate">{user?.name}</p>
                        <p className="text-xs text-ers-inkTertiary">{user?.role}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-ers-inkSecondary hover:text-emergency-600 hover:bg-emergency-50 transition-colors touch-target min-h-[48px]"
                    >
                      <LogOut className="w-5 h-5 shrink-0" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className={linkClass('/login')}>
                      Log in
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full justify-center mt-2">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
