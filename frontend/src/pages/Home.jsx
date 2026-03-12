import { Link } from 'react-router-dom';
import React, { Suspense, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { MapPreviewPlaceholder } from '../components/illustration/MapPreviewPlaceholder';
import { HeroCommandIllustration } from '../components/illustration/HeroCommandIllustration';
import { TrackingShowcaseIllustration } from '../components/illustration/TrackingShowcaseIllustration';
import { HospitalClusterIllustration } from '../components/illustration/HospitalClusterIllustration';
import { KenyaCityBlockIllustration } from '../components/illustration/KenyaCityBlockIllustration';
import { MapPin, Zap, Shield, ClipboardList, Building2 } from 'lucide-react';
import heroSceneConfig from '../config/scenes/hero-emergency-command-scene.json';

// 3D temporarily disabled (WebGL not painting in this environment). Keep JSON/renderer code in place for later.

const container = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const FEATURES = [
  { icon: MapPin, title: 'Precise location reporting', text: 'Report with GPS coordinates for accurate dispatch across counties and towns.', large: true },
  { icon: Zap, title: 'Fast dispatch', text: 'Nearest available units recommended instantly—ambulance, fire, police, or general.', large: false },
  { icon: Shield, title: 'Full audit trail', text: 'Every action logged for accountability and compliance.', large: false },
];

export function Home() {
  const { isAuthenticated, user } = useAuth();
  const isReporter = user?.role === 'REPORTER' || user?.role === 'ADMIN';
  const heroLabelRef = useRef(null);
  const heroLine1Ref = useRef(null);
  const heroLine2Ref = useRef(null);
  const heroBodyRef = useRef(null);
  const heroCtaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textCfg = heroSceneConfig?.gsap?.heroEntrance?.text;
      const from = textCfg?.from || { opacity: 0, y: 40 };
      const to = textCfg?.to || { opacity: 1, y: 0, duration: 1.0, stagger: 0.12 };
      gsap.fromTo(
        [heroLabelRef.current, heroLine1Ref.current, heroLine2Ref.current, heroBodyRef.current, heroCtaRef.current],
        { opacity: from.opacity ?? 0, y: from.y ?? 40 },
        { opacity: to.opacity ?? 1, y: to.y ?? 0, duration: to.duration ?? 1.0, stagger: to.stagger ?? 0.12, ease: 'power3.out', delay: 0.05 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-ers-bg"
      initial="initial"
      animate="animate"
      variants={container}
    >
      {/* Hero */}
      <section className="relative min-h-[85vh] lg:min-h-[88vh] flex flex-col lg:flex-row">
        <div className="relative z-10 lg:w-[42%] xl:w-[38%] flex flex-col justify-center px-5 sm:px-8 lg:pl-12 xl:pl-16 pt-24 sm:pt-28 pb-14 lg:pb-20">
          <p
            ref={heroLabelRef}
            className="font-display text-caption font-semibold uppercase tracking-[0.2em] text-emergency-600 mb-3"
          >
            Kenya Emergency Response
          </p>
          <h1 className="font-display font-bold text-ers-ink mb-4">
            <span ref={heroLine1Ref} className="block text-[clamp(2.75rem,6vw,4.25rem)] leading-[0.95] tracking-tight">
              Emergency
            </span>
            <span ref={heroLine2Ref} className="block text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-ers-inkSecondary">
              response, Kenya-wide.
            </span>
          </h1>
          <p
            ref={heroBodyRef}
            className="text-body-lg text-ers-inkSecondary leading-relaxed max-w-md mb-8"
          >
            Report incidents, dispatch responders, and track resolution in real time. Built for counties, towns, and command centres.
          </p>
          <div ref={heroCtaRef} className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                {isReporter && (
                  <Link to="/report" className="inline-flex">
                    <Button className="min-h-[48px] px-6">Report emergency</Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant={isReporter ? 'secondary' : 'primary'} className="min-h-[48px] px-6">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/report/guest" className="inline-flex">
                  <Button className="min-h-[48px] px-6">Report emergency</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" className="min-h-[48px] px-6">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="min-h-[48px] px-6">Register</Button>
                </Link>
              </>
            )}
          </div>
          {!isAuthenticated && (
            <p className="text-caption text-ers-inkTertiary mt-4">
              Report as guest with no account, or sign in to track your reports.
            </p>
          )}
        </div>
        {/* Hero visual (2D illustration while 3D is disabled) */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[340px] lg:min-h-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[55%] xl:w-[58%]">
          <HeroCommandIllustration />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-ers-subtle py-14 sm:py-18 lg:py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-caption font-semibold uppercase tracking-[0.15em] text-ers-inkTertiary mb-1.5">How it works</p>
            <h2 className="font-display font-semibold text-ers-ink text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-tight max-w-xl">
              Built for speed and accountability when every second counts.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
            {FEATURES.map(({ icon: Icon, title, text, large }, i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`md:col-span-12 flex flex-col ${large ? 'lg:col-span-6' : 'lg:col-span-3'}`}
              >
                <div className={`flex flex-col h-full ${large ? 'p-6 sm:p-8 border-l-4 border-emergency-600 bg-ers-surface/60' : 'p-5 sm:p-6 border border-ers-subtle bg-ers-elevated'} rounded-r-xl lg:rounded-xl`}>
                  {large ? (
                    <>
                      <div className="rounded-xl bg-emergency-50 w-fit flex items-center justify-center p-3 mb-4">
                        <Icon className="w-8 h-8 text-emergency-600" aria-hidden />
                      </div>
                      <h3 className="font-display font-semibold text-h4 text-ers-ink mb-1.5">{title}</h3>
                      <p className="text-body-sm text-ers-inkSecondary leading-relaxed flex-1">{text}</p>
                    </>
                  ) : (
                    <>
                      <div className="rounded-lg bg-emergency-50 w-fit flex items-center justify-center mb-4 p-2">
                        <Icon className="w-5 h-5 text-emergency-600" aria-hidden />
                      </div>
                      <h3 className="font-display font-semibold text-h4 text-ers-ink mb-1.5">{title}</h3>
                      <p className="text-body-sm text-ers-inkSecondary leading-relaxed flex-1">{text}</p>
                    </>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Product: editorial split – type left, “window” right */}
      <section className="bg-ers-surface border-t border-ers-subtle py-14 sm:py-18 lg:py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-caption font-semibold uppercase tracking-[0.15em] text-ers-inkTertiary mb-2">Product</p>
            <h2 className="font-display font-semibold text-h2 text-ers-ink tracking-tight mb-4">
              Live map and tracking
            </h2>
            <p className="text-body-sm text-ers-inkSecondary leading-relaxed mb-6 max-w-md">
              Incidents and responders on one map. ETA, distance, and status from report to resolution.
            </p>
            <ul className="space-y-3">
              {['Incidents by type and priority', 'Responder positions and units', 'Full audit log'].map((line, i) => (
                <li key={i} className="flex items-center gap-2.5 text-body-sm text-ers-inkSecondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-emergency-500 shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="lg:col-span-7 lg:col-start-6"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-xl overflow-hidden border border-ers-subtle shadow-ers-md bg-ers-elevated">
              <div className="h-8 px-4 flex items-center gap-2 border-b border-ers-subtle bg-ers-surface/80">
                <span className="w-2.5 h-2.5 rounded-full bg-ers-subtle" />
                <span className="w-2.5 h-2.5 rounded-full bg-ers-subtle" />
                <span className="w-2.5 h-2.5 rounded-full bg-ers-subtle" />
              </div>
              <div className="aspect-video min-h-[200px] relative">
                <TrackingShowcaseIllustration />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infrastructure showcase */}
      <section className="border-t border-ers-subtle py-14 sm:py-18 lg:py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-caption font-semibold uppercase tracking-[0.15em] text-ers-inkTertiary mb-2">Readiness</p>
            <h2 className="font-display font-semibold text-h2 text-ers-ink tracking-tight mb-4">
              Emergency infrastructure, visible at a glance
            </h2>
            <p className="text-body-sm text-ers-inkSecondary leading-relaxed mb-6 max-w-md">
              A clean view of hospitals, ER capacity, and response assets—designed to feel native to the product.
            </p>
            <ul className="space-y-3">
              {['Hospitals and emergency wings', 'Ambulance readiness', 'Beacon status cues'].map((line, i) => (
                <li key={i} className="flex items-center gap-2.5 text-body-sm text-ers-inkSecondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-emergency-500 shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="lg:col-span-7 lg:col-start-6"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-xl overflow-hidden border border-ers-subtle shadow-ers-md bg-ers-elevated relative aspect-video min-h-[220px]">
              <HospitalClusterIllustration />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kenya mapping showcase */}
      <section className="bg-ers-surface border-t border-ers-subtle py-14 sm:py-18 lg:py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-6 lg:order-2"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-caption font-semibold uppercase tracking-[0.15em] text-ers-inkTertiary mb-2">Kenya-first</p>
            <h2 className="font-display font-semibold text-h2 text-ers-ink tracking-tight mb-4">
              County-aware mapping and dispatch
            </h2>
            <p className="text-body-sm text-ers-inkSecondary leading-relaxed mb-6 max-w-md">
              A stylized urban block that communicates coverage, incident types, and movement—without noise or gimmicks.
            </p>
            <ul className="space-y-3">
              {['Incidents by type and priority', 'Responder routes and road context', 'Local context that feels Kenyan'].map((line, i) => (
                <li key={i} className="flex items-center gap-2.5 text-body-sm text-ers-inkSecondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="lg:col-span-6 lg:order-1"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-xl overflow-hidden border border-ers-subtle shadow-ers-md bg-ers-elevated relative aspect-video min-h-[220px]">
              <KenyaCityBlockIllustration />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kenya */}
      <section className="border-t border-ers-subtle py-14 sm:py-18 lg:py-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            className="font-display font-semibold text-ers-ink text-[clamp(1.35rem,2vw,1.75rem)] leading-snug mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            County-ready dispatch with full auditability for command centres and responders.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-x-8 gap-y-3"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Building2, label: 'Counties & towns' },
              { icon: ClipboardList, label: 'Incident tracking' },
              { icon: Shield, label: 'Audit trail' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-caption font-medium text-ers-inkSecondary">
                <Icon className="w-4 h-4 text-emergency-600/80" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ers-ink text-ers-bg py-14 sm:py-18 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-semibold text-h2 sm:text-[1.75rem] tracking-tight mb-2">
            Ready to report or coordinate?
          </h2>
          <p className="text-body-sm text-white/80 mb-6">
            Use the system as a guest or create an account for full access.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/report/guest">
              <Button variant="primary" className="!bg-white !text-ers-ink hover:!bg-white/90 min-h-[48px] px-6">Report as guest</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="!border-white/40 !text-white hover:!bg-white/10 min-h-[48px] px-6">Log in</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
