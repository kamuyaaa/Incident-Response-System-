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
  AlertTriangle,
} from 'lucide-react';

const ROLE_COLORS = {
  ADMIN: 'bg-violet-100 text-violet-700',
  SUPERVISOR: 'bg-blue-100 text-blue-700',
  REPORTER: 'bg-amber-100 text-amber-700',
  RESPONDER: 'bg-teal-100 text-teal-700',
};

const navItems = (role) => {
  const base = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/incidents', icon: ClipboardList, label: 'Incidents' },
    { to: '/map', icon: Map, label: 'Map' },
  ];
  if (role === 'REPORTER') base.push({ to: '/report', icon: AlertTriangle, label: 'Report' });
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

  const isActive = (to) => location.pathname === to;

  const linkClass = (to) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-150 touch-target min-h-[48px] ${
      isActive(to)
        ? 'bg-slate-900 text-white font-medium shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className={`sticky top-0 z-sticky border-b transition-colors duration-200 ${
      isLanding ? 'bg-white/80 backdrop-blur-md border-slate-200/60' : 'bg-white/90 backdrop-blur-md border-slate-200/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display font-bold touch-target min-w-[44px] min-h-[44px]"
          aria-label="ERS home"
        >
          <img src="/images/ers-logo.png" alt="" className="w-9 h-9 rounded-lg object-contain" />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-[15px] font-bold text-slate-900 tracking-tight">ERS Kenya</span>
            <span className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">Emergency Response</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {isAuthenticated ? (
            <>
              {navItems(user?.role).map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive(to)
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{label}</span>
                </Link>
              ))}
              <div className="flex items-center gap-2 pl-3 ml-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-xs font-medium text-slate-700 leading-none">{user?.name}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md inline-block mt-0.5 ${ROLE_COLORS[user?.role] || 'bg-slate-100 text-slate-600'}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Log out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="!py-2 !px-4 !min-h-0 text-sm font-medium">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="!py-2 !px-4 !min-h-0 text-sm font-medium">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${ROLE_COLORS[user?.role] || 'bg-slate-100 text-slate-600'}`}>
              {user?.role}
            </span>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="touch-target min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-overlay md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-white z-modal flex flex-col md:hidden shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/images/ers-logo.png" alt="" className="w-8 h-8 rounded-lg object-contain" />
                  <span className="font-display font-bold text-slate-900 text-sm">ERS Kenya</span>
                </div>
                <button type="button" onClick={() => setMobileOpen(false)} className="touch-target p-2 rounded-lg text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
                {isAuthenticated ? (
                  <>
                    {navItems(user?.role).map(({ to, icon: Icon, label }) => (
                      <Link key={to} to={to} onClick={() => setMobileOpen(false)} className={linkClass(to)}>
                        <Icon className="w-5 h-5 shrink-0" />
                        {label}
                      </Link>
                    ))}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md inline-block mt-0.5 ${ROLE_COLORS[user?.role] || 'bg-slate-100 text-slate-600'}`}>
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors touch-target min-h-[48px]"
                    >
                      <LogOut className="w-5 h-5 shrink-0" />
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className={linkClass('/login')}>
                      Sign in
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full justify-center mt-2">Get started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
