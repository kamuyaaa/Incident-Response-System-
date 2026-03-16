import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertCircle } from 'lucide-react';

const ROLES = [{ value: 'REPORTER', label: 'Reporter (report emergencies)' }];

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('REPORTER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ email, password, name, role });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 flex flex-col justify-center px-5 sm:px-8 py-12"
    >
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src="/images/ers-logo.png" alt="" className="w-10 h-10 rounded-lg object-contain" />
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">ERS Kenya</span>
              <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Emergency Response</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create account</h1>
          <p className="text-sm text-slate-500 mt-1">Report emergencies and track response</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required autoComplete="name" />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
          <Input label="Password (min 8 characters)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="new-password" />
          <div>
            <label className="text-label block mb-1.5">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="ers-input ers-input-touch">
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-body-sm text-emergency-600">{error}</p>}
          <Button type="submit" className="w-full min-h-[48px]" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </Button>
        </form>
        <p className="mt-6 text-body-sm text-ers-inkSecondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-emergency-600 hover:text-emergency-700 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
