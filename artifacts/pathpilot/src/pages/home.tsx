import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ArrowRight, Zap, Brain, TrendingUp, Code2 } from "lucide-react";

// ============================================================================
// SIMULATION PREVIEW COMPONENT
// ============================================================================
function SimulationPreview() {
  const scenario = {
    title: "Market Downturn Response",
    situation: "Your startup's funding is cut by 40%. Your team is waiting for direction.",
    decisions: [
      { id: 1, action: "Cut costs aggressively", consequence: "Short-term survival, but potential talent loss" },
      { id: 2, action: "Pivot to new market", consequence: "High risk, potential breakthrough opportunity" },
      { id: 3, action: "Seek new funding rounds", consequence: "Time-consuming but maintains team morale" },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Scenario</p>
        <h3 className="text-lg font-semibold text-white mb-3">{scenario.title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{scenario.situation}</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-slate-400">Decision Options</p>
        {scenario.decisions.map((decision) => (
          <motion.div
            key={decision.id}
            whileHover={{ backgroundColor: "rgba(88, 107, 197, 0.15)" }}
            className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 cursor-default transition-colors"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
                {decision.id}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{decision.action}</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs ml-9">{decision.consequence}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/30 rounded-lg p-4"
      >
        <p className="text-xs uppercase tracking-widest text-indigo-300 mb-2">Consequence Reveal</p>
        <p className="text-slate-200 text-sm">
          Your decision to pivot was analyzed against 42 similar scenarios. Risk tolerance +22%, Strategic thinking +18%.
        </p>
      </motion.div>
    </div>
  );
}

// ============================================================================
// RESULTS PREVIEW COMPONENT
// ============================================================================
function ResultsPreview() {
  const traits = [
    { name: "Risk Tolerance", value: 78, color: "#6366f1" },
    { name: "Analytical Thinking", value: 85, color: "#8b5cf6" },
    { name: "Leadership", value: 72, color: "#a78bfa" },
    { name: "Creativity", value: 68, color: "#c4b5fd" },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Career Match</p>
        <div className="flex items-end gap-3">
          <div>
            <p className="text-3xl font-bold text-white">Software Engineer</p>
            <p className="text-slate-400 text-sm mt-1">92% compatibility based on your decisions</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-4xl font-bold text-indigo-400">92%</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-6">Trait Profile</p>
        <div className="space-y-4">
          {traits.map((trait) => (
            <div key={trait.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white font-medium">{trait.name}</span>
                <span className="text-xs text-slate-400">{trait.value}%</span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.value}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  style={{ backgroundColor: trait.color }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-400 italic">
        "Your decisions in high-pressure scenarios showed strong analytical patterns, with a preference for data-driven trade-offs."
      </p>
    </div>
  );
}

// ============================================================================
// ANIMATED BACKGROUND GRID
// ============================================================================
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(99, 102, 241, 0.05) 25%, rgba(99, 102, 241, 0.05) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.05) 75%, rgba(99, 102, 241, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(99, 102, 241, 0.05) 25%, rgba(99, 102, 241, 0.05) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.05) 75%, rgba(99, 102, 241, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0"
      />
    </div>
  );
}

// ============================================================================
// SECTION WRAPPER
// ============================================================================
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      id={id}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ============================================================================
// MAIN HOME PAGE
// ============================================================================
export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -80]);

  return (
    <div ref={containerRef} className="relative bg-slate-950 text-white overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════════
          NAVIGATION
          ══════════════════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16"
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-[16px] tracking-tight">PathPilot</span>
        </div>

        <nav className="hidden lg:flex items-center gap-12">
          {[
            { label: "Overview", href: "#overview" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Simulation", href: "#simulation" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link href="/onboarding">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors duration-200"
          >
            Launch
          </motion.button>
        </Link>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        <AnimatedGrid />

        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">Simulation Engine</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6"
          >
            Simulate your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              career decisions
            </span>
            <br />
            before you commit.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience realistic career scenarios. Make high-stakes decisions. Receive behavioral analysis based on your actual choices—not preferences.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-[15px] transition-all duration-200 shadow-lg"
              >
                Start Simulation
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.15)" }}
              className="px-8 py-4 rounded-lg border border-slate-700 text-white font-medium text-[15px] transition-colors duration-200 hover:border-indigo-500/50"
            >
              Watch demo
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-indigo-400">2,400+</div>
              <p className="text-sm text-slate-500 mt-1">Students simulated</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-700" />
            <div>
              <div className="text-3xl font-bold text-indigo-400">94%</div>
              <p className="text-sm text-slate-500 mt-1">Would recommend</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-700" />
            <div>
              <div className="text-3xl font-bold text-indigo-400">18 min</div>
              <p className="text-sm text-slate-500 mt-1">Average completion</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════
          PROBLEM SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <Section id="overview" className="relative py-32 px-8 md:px-20">
        <AnimatedGrid />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">The Problem</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              Career choices are made <br />
              <span className="text-slate-500">without lived experience.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Students spend years preparing for futures they've never experienced. They choose based on salary expectations, parental pressure, or social media—not on how they actually perform under real constraints.
            </p>
          </motion.div>

          {/* Problem stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
            {[
              {
                stat: "73%",
                label: "of graduates regret their major",
                detail: "Federal Reserve data shows most students chose without understanding the work.",
              },
              {
                stat: "$127K",
                label: "average cost of wrong choice",
                detail: "Tuition + debt + lost opportunity cost in a field you abandon.",
              },
              {
                stat: "27%",
                label: "work in their field of study",
                detail: "Most spend years preparing for careers they never pursue.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-6 hover:bg-slate-900/70 transition-colors"
              >
                <div className="text-4xl font-bold text-indigo-400 mb-2">{item.stat}</div>
                <p className="text-white font-medium text-sm mb-2">{item.label}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <Section id="how-it-works" className="relative py-32 px-8 md:px-20 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent">
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Process</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              4 steps to <br />
              <span className="text-slate-500">career clarity.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                step: "01",
                title: "Initialize profile",
                description: "Tell us your interests, strengths, and goals. Under 3 minutes.",
              },
              {
                step: "02",
                title: "Enter simulation",
                description: "Experience realistic career scenarios. Make real-time decisions under pressure.",
              },
              {
                step: "03",
                title: "Process behavioral data",
                description: "AI analyzes your decisions: risk tolerance, thinking patterns, leadership style.",
              },
              {
                step: "04",
                title: "Generate career map",
                description: "Receive ranked career matches and a personalized roadmap to success.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-8 h-full group-hover:border-indigo-500/30 transition-colors duration-300">
                  <div className="flex items-start gap-6">
                    <div className="text-4xl font-bold text-indigo-500/40 group-hover:text-indigo-500/60 transition-colors">{item.step}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          SIMULATION PREVIEW SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <Section id="simulation" className="relative py-32 px-8 md:px-20">
        <AnimatedGrid />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Example</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Inside a <br />
              <span className="text-slate-500">career simulation.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-32"
            >
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-8">
                <SimulationPreview />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-4">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-indigo-300 font-medium">Behavioral Analysis</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">You're not answering a quiz.</h3>
                <p className="text-slate-400 leading-relaxed">
                  Every decision you make in a simulation is analyzed against thousands of data points. The system doesn't ask "What do you prefer?" It observes "How did you actually decide?"
                </p>
              </div>

              <div className="border-t border-slate-700/50 pt-6">
                <h4 className="text-lg font-semibold text-white mb-3">What we measure:</h4>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Risk tolerance in high-pressure decisions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Analytical vs. intuitive thinking patterns</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Leadership style under uncertainty</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Creative vs. systematic problem-solving</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          RESULTS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="relative py-32 px-8 md:px-20 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent">
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Outcomes</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your career <br />
              <span className="text-slate-500">blueprint.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-indigo-300 font-medium">Results-Driven</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Data-backed career recommendations.</h3>
                <p className="text-slate-400 leading-relaxed">
                  No generic personality types. No vague percentages. You get ranked career matches based on how you actually performed in realistic scenarios.
                </p>
              </div>

              <div className="border-t border-slate-700/50 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">You'll receive:</h4>
                <div className="space-y-3">
                  {[
                    "Top 5 career matches ranked by fit",
                    "Detailed trait analysis (radar chart)",
                    "Personalized learning roadmap",
                    "Internship & project recommendations",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-32"
            >
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-8">
                <ResultsPreview />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          FINAL CTA SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <Section className="relative py-32 px-8 md:px-20">
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden p-12 md:p-16 text-center"
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.2) 0%, transparent 60%), rgba(99, 102, 241, 0.05)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Ready to discover <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  your career fit
                </span>
                <span className="text-slate-500">?</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
                18 minutes. Real scenarios. Data-backed insights. Join 2,400+ students who already know their next move.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/onboarding">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99, 102, 241, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-[15px] transition-all duration-200 shadow-lg"
                  >
                    Start Simulation
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-4 rounded-lg border border-slate-700 text-white font-medium text-[15px] transition-colors duration-200 hover:border-indigo-500/50"
                >
                  Learn more
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-800/50 px-8 md:px-20 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">PathPilot</span>
          </div>
          <p className="text-sm text-slate-500">Career discovery through behavioral simulation.</p>
          <p className="text-xs text-slate-600">© 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
