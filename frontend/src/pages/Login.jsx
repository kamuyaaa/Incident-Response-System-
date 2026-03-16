import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { DEMO } from '../api/endpoints';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertCircle, LogIn, Loader2, Users, Eye, EyeOff } from 'lucide-react';

const ROLE_ORDER = ['ADMIN', 'SUPERVISOR', 'REPORTER', 'RESPONDER'];
const ROLE_LABELS = { ADMIN: 'Admin', SUPERVISOR: 'Supervisor', REPORTER: 'Reporter', RESPONDER: 'Responder' };
const ROLE_STYLES = {
  ADMIN: 'text-violet-700 border-violet-300 bg-violet-50',
  SUPERVISOR: 'text-blue-700 border-blue-300 bg-blue-50',
  REPORTER: 'text-amber-800 border-amber-300 bg-amber-50',
  RESPONDER: 'text-teal-700 border-teal-300 bg-teal-50',
};
const SERVICE_TYPE_LABELS = {
  ambulance: 'Ambulance',
  fire_truck: 'Fire',
  police: 'Police',
  general: 'General',
};

function groupAccountsByRole(accounts) {
  const byRole = {};
  ROLE_ORDER.forEach((r) => { byRole[r] = []; });
  (accounts || []).forEach((acc) => {
    if (ROLE_ORDER.includes(acc.role)) byRole[acc.role].push(acc);
    else byRole[acc.role] = (byRole[acc.role] || []).concat(acc);
  });
  return ROLE_ORDER.map((role) => ({ role, accounts: byRole[role] || [] })).filter((g) => g.accounts.length > 0);
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [demoLoading, setDemoLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState(() => new Set());
  const [activeRole, setActiveRole] = useState(null);
  const { login } = useAuth();

  const togglePasswordVisible = (email) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    api.get(DEMO.accounts).then((res) => setDemoAccounts(res.data || [])).catch(() => setDemoAccounts([])).finally(() => setDemoLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  const groups = groupAccountsByRole(demoAccounts);
  const activeGroup = activeRole ? groups.find((g) => g.role === activeRole) : groups[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 flex flex-col lg:flex-row"
    >
      {/* Left: form */}
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-14 xl:px-20 py-12 lg:py-16">
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/ers-logo.png" alt="" className="w-10 h-10 rounded-lg object-contain" />
              <div>
                <span className="text-sm font-bold text-slate-900 tracking-tight">ERS Kenya</span>
                <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Emergency Response</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your account to continue.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            {error && <p className="text-body-sm text-emergency-600">{error}</p>}
            <Button type="submit" className="w-full min-h-[48px]" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-body-sm text-ers-inkSecondary">
            No account?{' '}
            <Link to="/register" className="font-medium text-emergency-600 hover:text-emergency-700 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right: demo accounts */}
      <div className="lg:w-[380px] xl:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col">
        <div className="p-5 sm:p-6 flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-sky-600" aria-hidden />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Demo accounts</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Try different roles. Select a role tab and click Use to auto-fill the login form.
          </p>
          {demoLoading ? (
            <div className="flex items-center justify-center py-16 text-ers-inkTertiary">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : groups.length === 0 ? (
            <div className="py-10 text-center text-body-sm text-ers-inkTertiary border border-ers-subtle rounded-xl">
              No demo accounts available.
            </div>
          ) : (
            <>
              {/* Role tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {groups.map(({ role }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-caption font-semibold border transition-colors ${
                      (activeRole || groups[0].role) === role
                        ? ROLE_STYLES[role] || 'bg-ers-subtle text-ers-ink border-ers-subtle'
                        : 'border-ers-subtle text-ers-inkTertiary hover:text-ers-ink hover:border-ers-inkSecondary/40'
                    }`}
                  >
                    {ROLE_LABELS[role] || role}
                  </button>
                ))}
              </div>
              {/* Account list for selected role */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
                {(activeGroup || groups[0])?.accounts.map((acc) => (
                  <div
                    key={acc.email}
                    className="group rounded-xl border border-ers-subtle bg-ers-elevated p-3.5 transition-colors hover:border-ers-inkSecondary/30"
                  >
                    <p className="font-medium text-ers-ink text-body-sm">{acc.name}</p>
                    <p className="text-caption font-mono text-ers-inkTertiary truncate mt-0.5">{acc.email}</p>
                    {acc.serviceType && (
                      <p className="text-caption text-ers-inkTertiary mt-0.5">{SERVICE_TYPE_LABELS[acc.serviceType] || acc.serviceType.replace(/_/g, ' ')}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-caption font-mono text-ers-inkSecondary bg-ers-subtle/80 px-2 py-1 rounded flex-1 min-w-0 truncate">
                        {visiblePasswords.has(acc.email) ? acc.password : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisible(acc.email)}
                        className="p-1.5 rounded-lg text-ers-inkTertiary hover:text-ers-ink hover:bg-ers-subtle/80"
                        aria-label={visiblePasswords.has(acc.email) ? 'Hide password' : 'Show password'}
                      >
                        {visiblePasswords.has(acc.email) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Button type="button" variant="secondary" onClick={() => fillDemo(acc)} className="!py-2 !px-3 text-xs !min-h-0 shrink-0">
                        <LogIn className="w-3.5 h-3.5 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-5 sm:p-6 border-t border-ers-subtle">
          <Link to="/report/guest" className="block">
            <Button variant="outline" className="w-full min-h-[42px] text-btn">
              Continue as guest
            </Button>
          </Link>
          <p className="text-caption text-ers-inkTertiary mt-1.5 text-center">Report without an account</p>
        </div>
      </div>
    </motion.div>
  );
}
