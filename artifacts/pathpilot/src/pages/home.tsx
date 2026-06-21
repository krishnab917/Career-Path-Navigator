import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";

function CountUp({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return controls.stop;
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function OrbVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Mid ring */}
      <motion.div
        className="absolute rounded-full border border-primary/20"
        style={{ width: 380, height: 380 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"
          style={{ boxShadow: "0 0 12px 4px rgba(139,92,246,0.8)" }}
        />
      </motion.div>
      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full border border-primary/10"
        style={{ width: 260, height: 260 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-violet-400"
          style={{ boxShadow: "0 0 10px 3px rgba(167,139,250,0.8)" }}
        />
      </motion.div>
      {/* Core orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: 160,
          height: 160,
          background: "radial-gradient(circle at 35% 35%, rgba(167,139,250,0.9) 0%, rgba(139,92,246,0.7) 40%, rgba(79,70,229,0.4) 70%, transparent 100%)",
          boxShadow: "0 0 60px 20px rgba(139,92,246,0.35), inset 0 0 40px rgba(255,255,255,0.1)",
        }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-white font-bold text-3xl tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>P</span>
      </motion.div>
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/60"
          style={{
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            top: `${20 + i * 12}%`,
            left: `${10 + i * 13}%`,
          }}
          animate={{
            y: [0, -16, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2.5 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const problems = [
  {
    stat: "73%",
    label: "of students regret their college major",
    detail: "Federal Reserve research shows nearly three quarters of graduates wish they had chosen differently — after it was too late.",
  },
  {
    stat: "$124K",
    label: "average cost of choosing the wrong field",
    detail: "When you factor in tuition, student debt, and years of lost career momentum, a poor decision costs six figures.",
  },
  {
    stat: "27%",
    label: "of graduates work in their field of study",
    detail: "The vast majority of students spend years preparing for careers they ultimately abandon.",
  },
];

const steps = [
  {
    number: "01",
    title: "Complete your profile",
    description: "Tell us about your academic interests, strongest subjects, activities, and goals. Takes under 3 minutes.",
  },
  {
    number: "02",
    title: "Enter a career simulation",
    description: "Step into immersive, real-world career scenarios. Make decisions under realistic constraints. Experience the consequences.",
  },
  {
    number: "03",
    title: "Receive behavioral analysis",
    description: "Discover your primary career match, confidence scores, and a behavioral breakdown based on how you actually performed.",
  },
  {
    number: "04",
    title: "Act on your roadmap",
    description: "Get a personalized roadmap of courses, certifications, competitions, and internships to reach your recommended career.",
  },
];

const careers = [
  { title: "Software Engineer", tag: "Technology", color: "#6366f1", time: "25 min", stages: 5 },
  { title: "Emergency Medicine", tag: "Healthcare", color: "#ef4444", time: "30 min", stages: 5 },
  { title: "Startup Founder", tag: "Entrepreneurship", color: "#f59e0b", time: "30 min", stages: 5 },
];

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -60]);

  return (
    <div ref={containerRef} className="bg-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="font-semibold text-[15px] tracking-tight text-white">PathPilot</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {["Problem", "How it works", "Simulations"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>
        <Link href="/onboarding">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-sm font-medium px-4 py-1.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-200"
          >
            Get started
          </motion.button>
        </Link>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative min-h-screen flex overflow-hidden">
        {/* Background ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background: "linear-gradient(to top, black, transparent)" }} />
        </div>

        {/* Left: text */}
        <div className="relative z-10 flex flex-col justify-center pl-12 md:pl-20 pt-24 pb-16 w-full md:w-[55%]">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="h-px w-8 bg-white/30" />
            <span className="text-sm text-white/40 tracking-widest uppercase font-medium">Career discovery, reimagined</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            Experience your
            <br />
            <span style={{ color: "#a78bfa" }}>future</span> before
            <br />
            you choose it.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="mt-8 text-lg text-white/50 max-w-md leading-relaxed"
          >
            Most students choose careers based on assumptions and secondhand advice.
            PathPilot lets you <em className="text-white/80 not-italic">live</em> them first — through immersive simulations that reveal your true fit.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="mt-10 flex items-center gap-4"
          >
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: "#a78bfa" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-semibold text-[15px] transition-all duration-200"
                style={{ boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/simulations">
              <motion.button
                whileHover={{ color: "rgba(255,255,255,1)" }}
                className="flex items-center gap-1.5 text-[15px] text-white/50 font-medium transition-colors duration-200"
              >
                Browse simulations <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Inline stats */}
          <motion.div
            variants={fadeUp}
            custom={5}
            initial="hidden"
            animate="visible"
            className="mt-20 grid grid-cols-3 gap-8 border-t border-white/8 pt-8 max-w-md"
          >
            {[
              { n: 500, suffix: "+", label: "students guided" },
              { n: 3, suffix: " careers", label: "available now" },
              { n: 98, suffix: "%", label: "would recommend" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-white tracking-tight">
                  <CountUp target={s.n} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/35 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: orb */}
        <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-[48%] items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <OrbVisual />
          </motion.div>
        </div>
      </motion.div>

      {/* ── PROBLEM SECTION ── */}
      <Section id="problem" className="py-32 px-8 md:px-20">
        <motion.div variants={fadeUp} className="mb-4">
          <span className="text-xs uppercase tracking-widest text-white/30 font-medium">The problem</span>
        </motion.div>
        <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl mb-6">
          Career decisions are made <span style={{ color: "#a78bfa" }}>blindly</span>.
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-lg text-white/45 max-w-2xl mb-20 leading-relaxed">
          Students spend years preparing for futures they've never actually experienced — choosing based on salary expectations, parental advice, or social media. The consequences are enormous.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden">
          {problems.map((p, i) => (
            <motion.div
              key={p.stat}
              variants={fadeUp}
              custom={i + 3}
              className="bg-black p-10 relative group"
            >
              <motion.div
                className="absolute inset-0 rounded-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{ background: "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.08), transparent 70%)" }}
              />
              <div className="text-5xl md:text-6xl font-bold mb-4" style={{ color: "#a78bfa" }}>
                <CountUp
                  target={parseInt(p.stat.replace(/[^0-9]/g, ""))}
                  suffix={p.stat.includes("K") ? "K" : p.stat.includes("%") ? "%" : ""}
                />
              </div>
              <div className="text-[15px] font-medium text-white mb-3 leading-snug">{p.label}</div>
              <div className="text-sm text-white/35 leading-relaxed">{p.detail}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── SOLUTION ── */}
      <Section id="how-it-works" className="py-32 px-8 md:px-20">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          <div className="md:w-[40%] sticky top-24">
            <motion.div variants={fadeUp} className="mb-4">
              <span className="text-xs uppercase tracking-widest text-white/30 font-medium">The solution</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Simulate. Analyze. <span style={{ color: "#a78bfa" }}>Decide.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-base text-white/45 leading-relaxed mb-8">
              PathPilot replaces guesswork with experience. You make real decisions under real constraints — and receive a behavioral analysis of how you performed, not just what you preferred.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Link href="/onboarding">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-violet-300 transition-colors"
                >
                  Begin your simulation <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <div className="md:w-[60%] space-y-px">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ backgroundColor: "rgba(139,92,246,0.05)" }}
                className="group p-8 border-t border-white/8 transition-colors duration-300 cursor-default"
              >
                <div className="flex items-start gap-6">
                  <span className="text-xs font-mono text-white/20 mt-1 w-6 shrink-0">{step.number}</span>
                  <div>
                    <h3 className="text-[17px] font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">{step.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors ml-auto mt-0.5 shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SIMULATIONS ── */}
      <Section id="simulations" className="py-32 px-8 md:px-20">
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/30 font-medium">Available now</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Career simulations</h2>
          </div>
          <Link href="/simulations">
            <motion.button
              whileHover={{ color: "rgba(167,139,250,1)" }}
              className="hidden md:flex items-center gap-1.5 text-sm text-white/40 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {careers.map((c, i) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              custom={i + 2}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Link href="/simulations">
                <div
                  className="relative rounded-2xl p-8 h-64 flex flex-col justify-between overflow-hidden cursor-pointer group"
                  style={{
                    background: `radial-gradient(circle at 70% 20%, ${c.color}22, transparent 60%), rgba(255,255,255,0.03)`,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{ background: `radial-gradient(circle at 50% 50%, ${c.color}18, transparent 70%)` }}
                  />
                  <div className="relative">
                    <div
                      className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider"
                      style={{ background: `${c.color}25`, color: c.color }}
                    >
                      {c.tag}
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight">{c.title}</h3>
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-white/35">
                      <span>{c.stages} stages</span>
                      <span>·</span>
                      <span>{c.time}</span>
                    </div>
                    <motion.div
                      className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center group-hover:border-white/40 transition-colors"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section className="py-32 px-8 md:px-20">
        <motion.div
          variants={fadeUp}
          className="relative rounded-3xl overflow-hidden p-16 md:p-24 text-center"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.25) 0%, transparent 60%), rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Animated gradient pulse */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)", filter: "blur(24px)" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative z-10">
            <motion.div variants={fadeUp} className="mb-3">
              <span className="text-xs uppercase tracking-widest text-white/30 font-medium">Ready to begin?</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Don't guess your future.<br />
              <span style={{ color: "#a78bfa" }}>Experience it.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-base text-white/45 max-w-lg mx-auto mb-10 leading-relaxed">
              Join students who discovered their career fit through simulation — not assumption. It takes under 30 minutes. The insight lasts a lifetime.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-4">
              <Link href="/onboarding">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(139,92,246,0.6)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold text-[15px] transition-all duration-200"
                  style={{ boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}
                >
                  Start for free <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/simulations">
                <motion.button
                  whileHover={{ color: "rgba(255,255,255,1)" }}
                  className="text-[15px] text-white/45 font-medium transition-colors flex items-center gap-1.5"
                >
                  Preview a simulation <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="px-8 md:px-20 py-10 border-t border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/80 flex items-center justify-center text-white font-bold text-xs">P</div>
          <span className="text-sm font-medium text-white/40">PathPilot</span>
        </div>
        <p className="text-xs text-white/20">Career discovery through simulation</p>
      </footer>
    </div>
  );
}
