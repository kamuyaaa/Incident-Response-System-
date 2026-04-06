const FEATURES = [
  {
    title: "Incident Tracking",
    body: "Log and follow incidents from report to resolution with clear status and priority.",
    icon: "📋",
  },
  {
    title: "Real-Time Monitoring",
    body: "Stay updated as assignments and incidents change across your team.",
    icon: "📡",
  },
  {
    title: "Response Coordination",
    body: "Connect reporters, responders, and admins in one structured workflow.",
    icon: "🤝",
  },
  {
    title: "Reporting Dashboard",
    body: "Overview dashboards for admins to monitor queues and assignments.",
    icon: "📊",
  },
];

export default function FeaturesSection() {
  return (
    <section className="lp-features" aria-labelledby="lp-features-heading">
      <h2 id="lp-features-heading" className="lp-section-title">
        Capabilities
      </h2>
      <div className="lp-features__grid">
        {FEATURES.map((f) => (
          <article key={f.title} className="lp-feature-card">
            <span className="lp-feature-card__icon" aria-hidden>
              {f.icon}
            </span>
            <h3 className="lp-feature-card__title">{f.title}</h3>
            <p className="lp-feature-card__body">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
