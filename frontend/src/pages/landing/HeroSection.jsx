import logo from "../../assets/logo.png";

export default function HeroSection({ onLogin, onGuest }) {
  return (
    <header className="lp-hero">
      <img src={logo} alt="SafeReport" className="lp-hero__logo" />
      <p className="lp-hero__eyebrow">Incident Response System</p>
      <h1 className="lp-hero__title">SafeReport</h1>
      <p className="lp-hero__lead">
        Report emergencies and incidents in real time. Help responders coordinate
        faster, track progress, and keep communities safe.
      </p>
      <div className="lp-hero__actions">
        <button type="button" className="lp-btn lp-btn--primary" onClick={onLogin}>
          Log in
        </button>
        <button type="button" className="lp-btn lp-btn--ghost" onClick={onGuest}>
          Continue as guest
        </button>
      </div>
    </header>
  );
}
