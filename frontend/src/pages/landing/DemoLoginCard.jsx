import { useNavigate } from "react-router-dom";
import { DEMO_USERS, PRIMARY_DEMO } from "./demoCredentials";

export default function DemoLoginCard() {
  const navigate = useNavigate();

  const goLoginWithDemo = (demo) => {
    navigate("/login", {
      state: {
        demoLogin: {
          email: demo.email,
          password: demo.password,
          role: demo.role,
        },
      },
    });
  };

  return (
    <section className="lp-demo" aria-labelledby="lp-demo-heading">
      <h2 id="lp-demo-heading" className="lp-section-title">
        Demo login
      </h2>
      <div className="lp-demo__card">
        <p className="lp-demo__label">Demo credentials</p>
        <dl className="lp-demo__credentials">
          <div>
            <dt>Email</dt>
            <dd>{PRIMARY_DEMO.email}</dd>
          </div>
          <div>
            <dt>Password</dt>
            <dd>{PRIMARY_DEMO.password}</dd>
          </div>
        </dl>
        <p className="lp-demo__hint">Seeded for local development (reporter role).</p>
        <button
          type="button"
          className="lp-btn lp-btn--primary lp-btn--block"
          onClick={() => goLoginWithDemo(PRIMARY_DEMO)}
        >
          Autofill &amp; open login
        </button>
        <div className="lp-demo__roles">
          <span className="lp-demo__roles-label">Also try:</span>
          <button
            type="button"
            className="lp-chip"
            onClick={() => goLoginWithDemo(DEMO_USERS.responder)}
          >
            Responder
          </button>
          <button
            type="button"
            className="lp-chip"
            onClick={() => goLoginWithDemo(DEMO_USERS.admin)}
          >
            Admin
          </button>
        </div>
      </div>
    </section>
  );
}
