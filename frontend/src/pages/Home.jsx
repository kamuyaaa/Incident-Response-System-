import { Link } from 'react-router-dom';
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { MapPin, Zap, Shield, ClipboardList, Building2, PhoneCall } from 'lucide-react';
import heroSceneConfig from '../config/scenes/hero-emergency-command-scene.json';
import { EMERGENCY_CONTACTS } from '../config/emergencyContacts';

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
  const isReporter = user?.role === 'REPORTER';
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
      <section className="relative min-h-[85vh] lg:min-h-[88vh] flex flex-col lg:flex-row overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50" />
        <div className="relative z-10 lg:w-[45%] xl:w-[42%] flex flex-col justify-center px-5 sm:px-8 lg:pl-12 xl:pl-16 pt-24 sm:pt-28 pb-14 lg:pb-20">
          <p
            ref={heroLabelRef}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Kenya Emergency Response
          </p>
          <h1 className="font-display font-extrabold text-slate-900 mb-5">
            <span ref={heroLine1Ref} className="block text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.95] tracking-tight">
              Emergency
            </span>
            <span ref={heroLine2Ref} className="block text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-tight bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
              response, Kenya-wide.
            </span>
          </h1>
          <p
            ref={heroBodyRef}
            className="text-base text-slate-600 leading-relaxed max-w-md mb-8"
          >
            Report incidents, dispatch responders, and track resolution in real time. Built for counties, towns, and command centres.
          </p>
          <div ref={heroCtaRef} className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                {isReporter && (
                  <Link to="/report" className="inline-flex">
                    <Button className="min-h-[48px] px-6 shadow-lg shadow-red-500/20">Report emergency</Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant={isReporter ? 'secondary' : 'primary'} className="min-h-[48px] px-6">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/report/guest" className="inline-flex">
                  <Button className="min-h-[48px] px-6 shadow-lg shadow-red-500/20">Report emergency</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" className="min-h-[48px] px-6">Sign in</Button>
                </Link>
              </>
            )}
          </div>
          {!isAuthenticated && (
            <p className="text-xs text-slate-400 mt-4">
              Report as guest — no account needed. Or sign in for full access.
            </p>
          )}
        </div>
        {/* Hero visual */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[340px] lg:min-h-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[52%] xl:w-[55%] flex items-center justify-center p-6 lg:p-12">
          <img
            src="/images/hero-command-3d.png"
            alt="Emergency command center"
            className="w-full h-full object-contain drop-shadow-2xl"
            loading="eager"
          />
        </div>
      </section>

      {/* Emergency contacts */}
      <section className="border-t border-slate-200 py-12 sm:py-16 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Emergency contacts
              </p>
              <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                Call the right service, fast.
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Kenya-focused emergency lines. On mobile, tap to dial directly.
              </p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-slate-600">
              <span className="font-semibold text-red-600">If life-threatening:</span> call immediately, then report in-app.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {EMERGENCY_CONTACTS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-red-50 p-2.5 transition-colors group-hover:bg-red-100">
                        <Icon className="w-5 h-5 text-red-600" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {c.phone}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2.5">
                    <a
                      href={`tel:${c.phone}`}
                      className="flex-1"
                      aria-label={`Call ${c.name} at ${c.phone}`}
                    >
                      <Button variant="danger" className="w-full min-h-[42px]">
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Call now
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200 py-14 sm:py-18 lg:py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">How it works</p>
            <h2 className="font-display font-bold text-slate-900 text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-tight max-w-xl">
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
                <div className={`flex flex-col h-full ${large ? 'p-6 sm:p-8 border border-slate-200 bg-white shadow-sm' : 'p-5 sm:p-6 border border-slate-200 bg-white shadow-sm'} rounded-xl hover:shadow-md transition-shadow`}>
                  <div className={`rounded-lg w-fit flex items-center justify-center mb-4 ${large ? 'p-3 bg-red-50' : 'p-2.5 bg-slate-100'}`}>
                    <Icon className={`${large ? 'w-7 h-7 text-red-600' : 'w-5 h-5 text-slate-600'}`} aria-hidden />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">{text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Product: editorial split – type left, “window” right */}
      <section className="bg-white border-t border-slate-200 py-14 sm:py-18 lg:py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Product</p>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight mb-4">
              Live map and tracking
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-md">
              Incidents and responders on one map. ETA, distance, and status from report to resolution.
            </p>
            <ul className="space-y-3">
              {['Incidents by type and priority', 'Responder positions and units', 'Full audit log'].map((line, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
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
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
              <div className="h-8 px-4 flex items-center gap-1.5 border-b border-slate-100 bg-slate-50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
              </div>
              <div className="aspect-video min-h-[200px] relative flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50/40">
                <img
                  src="/images/tracking-dispatch-3d.png"
                  alt="Live tracking and dispatch"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infrastructure showcase */}
      <section className="border-t border-slate-200 py-14 sm:py-18 lg:py-20 px-5 sm:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Readiness</p>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight mb-4">
              Emergency infrastructure, visible at a glance
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-md">
              A clean view of hospitals, ER capacity, and response assets designed to feel native to the product.
            </p>
            <ul className="space-y-3">
              {['Hospitals and emergency wings', 'Ambulance readiness', 'Beacon status cues'].map((line, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
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
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-gradient-to-br from-slate-50 to-amber-50/30 relative aspect-video min-h-[220px] flex items-center justify-center">
              <img
                src="/images/hospital-readiness-3d.png"
                alt="Emergency infrastructure readiness"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kenya mapping showcase */}
      <section className="bg-white border-t border-slate-200 py-14 sm:py-18 lg:py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-6 lg:order-2"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Kenya-first</p>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight mb-4">
              County-aware mapping and dispatch
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-md">
              Coverage, incident types, and movement visualized on an urban block — without noise or gimmicks.
            </p>
            <ul className="space-y-3">
              {['Incidents by type and priority', 'Responder routes and road context', 'Local context that feels Kenyan'].map((line, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
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
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-gradient-to-br from-slate-50 to-emerald-50/30 relative aspect-video min-h-[220px] flex items-center justify-center">
              <img
                src="/images/kenya-city-3d.png"
                alt="Kenya city block dispatch coverage"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kenya */}
      <section className="border-t border-slate-200 py-14 sm:py-18 lg:py-20 px-5 sm:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            className="font-display font-bold text-slate-900 text-[clamp(1.35rem,2vw,1.75rem)] leading-snug mb-6"
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
              <span key={label} className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <Icon className="w-4 h-4 text-sky-500" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-3">
            Ready to report or coordinate?
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            Use the system as a guest or create an account for full access.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/report/guest">
              <Button variant="primary" className="!bg-white !text-slate-900 hover:!bg-slate-100 min-h-[48px] px-6 font-semibold shadow-lg">Report as guest</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="!border-slate-600 !text-slate-300 hover:!bg-slate-800 hover:!text-white min-h-[48px] px-6">Sign in</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
