import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="lp-footer">
      <p className="lp-footer__brand">SafeReport · Incident Response System</p>
      <nav className="lp-footer__nav" aria-label="Footer">
        <Link to="/register">Register</Link>
        <span className="lp-footer__sep" aria-hidden>
          ·
        </span>
        <Link to="/login">Login</Link>
      </nav>
      <p className="lp-footer__copy">Built for structured incident management.</p>
    </footer>
  );
}
