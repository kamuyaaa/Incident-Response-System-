import { Link } from 'react-router-dom';
import logoSvg from '../../assets/logo/logo-icon.svg?url';

const links = [
  { to: '/report/guest', label: 'Report emergency' },
  { to: '/login', label: 'Log in' },
  { to: '/map', label: 'Map' },
];
const legal = [
  { to: '#', label: 'Privacy' },
  { to: '#', label: 'Terms' },
];

export function Footer() {
  return (
    <footer className="border-t border-ers-subtle bg-ers-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src={logoSvg} alt="" className="w-8 h-9 object-contain" aria-hidden />
            <span className="text-h4 text-ers-ink font-semibold">Kenya Emergency Response</span>
          </div>
          <nav className="flex flex-wrap items-center gap-5">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-body-sm font-medium text-ers-inkSecondary hover:text-emergency-600 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-ers-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-caption text-ers-inkTertiary max-w-md">
            County-ready dispatch and incident tracking with full auditability.
          </p>
          <div className="flex items-center gap-5">
            {legal.map(({ to, label }) => (
              <a key={label} href={to} className="text-caption text-ers-inkTertiary hover:text-ers-inkSecondary transition-colors duration-200">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
