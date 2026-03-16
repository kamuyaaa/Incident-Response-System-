import { Link } from 'react-router-dom';

const links = [
  { to: '/report/guest', label: 'Report emergency' },
  { to: '/login', label: 'Sign in' },
  { to: '/map', label: 'Map' },
];
const legal = [
  { to: '#', label: 'Privacy' },
  { to: '#', label: 'Terms' },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/images/ers-logo.png" alt="" className="w-8 h-8 rounded-lg object-contain" aria-hidden />
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">ERS Kenya</span>
              <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Emergency Response</span>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-5">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-400">
            County-ready dispatch and incident tracking with full auditability.
          </p>
          <div className="flex items-center gap-5">
            {legal.map(({ to, label }) => (
              <a key={label} href={to} className="text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
