import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Zap, Brain, TrendingUp, Code2, CheckCircle } from "lucide-react";
import { StateLabel } from "@/components/state-label";

// ─── Animated background grid ─────────────────────────────────────────────────
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
    </div>
  );
}

// ─── Section wrapper with fade-in ────────────────────────────────────────────
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

// ─── Simulation preview (mini) ────────────────────────────────────────────────
function SimulationPreview() {
  const decisions = [
    { id: 1, action: "Cut costs aggressively", consequence: "Short-term survival, potential talent loss", risk: "medium" },
    { id: 2, action: "Pivot to new market", consequence: "High risk, potential breakthrough", risk: "high" },
    { id: 3, action: "Seek new funding rounds", consequence: "Time-consuming but maintains morale", risk: "low" },
  ];

  const riskColors: Record<string, string> = {
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    high: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live Scenario</p>
        <StateLabel variant="time-pressure" label="Time Pressure" />
      </div>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Situation Briefing</p>
        <h3 className="text-sm font-bold text-white mb-2">Market Downturn Response</h3>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Your startup's funding is cut by 40%. Your team is waiting for direction.
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Select your course of action</p>
        {decisions.map((d) => (
          <div
            key={d.id}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2 flex-1">
              <div className="w-5 h-5 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-zinc-500 flex-shrink-0 mt-0.5">
                {d.id}
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-200">{d.action}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{d.consequence}</p>
              </div>
            </div>
            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${riskColors[d.risk]}`}>
              {d.risk}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Results preview ──────────────────────────────────────────────────────────
function ResultsPreview() {
  const traits = [
    { name: "Risk Tolerance", value: 78, color: "#6366f1" },
    { name: "Analytical Thinking", value: 85, color: "#8b5cf6" },
    { name: "Leadership", value: 72, color: "#a78bfa" },
    { name: "Creativity", value: 68, color: "#c4b5fd" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Analysis Output</p>
        <StateLabel variant="completed" label="Completed" />
      </div>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">Career Match</p>
        <div className="flex items-end gap-3">
          <div>
            <p className="text-xl font-bold text-white">Software Engineer</p>
            <p className="text-zinc-500 text-xs mt-1">92% compatibility based on your decisions</p>
          </div>
          <div className="ml-auto text-3xl font-bold text-indigo-400">92%</div>
        </div>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Trait Profile</p>
        <div className="space-y-3">
          {traits.map((trait) => (
            <div key={trait.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white font-medium">{trait.name}</span>
                <span className="text-[11px] text-zinc-500 font-mono">{trait.value}%</span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
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
    </div>
  );
}

// ─── Main home page ───────────────────────────────────────────────────────────
export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -80]);

  return (
    <div ref={containerRef} className="relative bg-slate-950 text-white overflow-hidden">

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14"
        style={{
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight">PathPilot</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
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
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors duration-200"
          >
            Launch
          </motion.button>
        </Link>
      </motion.nav>

      {/* ── HERO — Primary action zone ───────────────────────────────────── */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14"
      >
        <AnimatedGrid />

        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          {/* System badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">Simulation Engine v2</span>
            </div>
          </motion.div>

          {/* Headline — ONE primary message */}
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience realistic career scenarios. Make high-stakes decisions. Receive behavioral
            analysis based on your actual choices — not preferences.
          </motion.p>

          {/* ONE primary CTA */}
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
            <a href="#how-it-works">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.15)" }}
                className="px-8 py-4 rounded-lg border border-slate-700 text-white font-medium text-[15px] transition-colors duration-200 hover:border-indigo-500/50"
              >
                How it works
              </motion.button>
            </a>
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

      {/* ── OVERVIEW — Problem section ───────────────────────────────────── */}
      <Section id="overview" className="relative py-24 px-8 md:px-20">
        <AnimatedGrid />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">The Problem</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Career choices are made{" "}
              <span className="text-slate-500">without lived experience.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Students spend years preparing for futures they've never experienced. They choose based
              on salary expectations, parental pressure, or social media — not on how they actually
              perform under real constraints.
            </p>
          </motion.div>

          {/* Problem stats — SystemCard-style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              {
                stat: "73%",
                label: "of graduates regret their major",
                detail: "Federal Reserve data shows most students chose without understanding the work.",
                state: "high-risk" as const,
              },
              {
                stat: "$127K",
                label: "average cost of wrong choice",
                detail: "Tuition + debt + lost opportunity cost in a field you abandon.",
                state: "high-risk" as const,
              },
              {
                stat: "27%",
                label: "work in their field of study",
                detail: "Most spend years preparing for careers they never pursue.",
                state: "evolving" as const,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-900/70 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl font-bold text-indigo-400">{item.stat}</div>
                  <StateLabel variant={item.state} />
                </div>
                <p className="text-white font-semibold text-sm mb-2">{item.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <Section
        id="how-it-works"
        className="relative py-24 px-8 md:px-20 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent"
      >
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Process</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              4 steps to <span className="text-slate-500">career clarity.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { step: "01", title: "Initialize profile", description: "Tell us your interests, strengths, and goals. Under 3 minutes." },
              { step: "02", title: "Enter simulation", description: "Experience realistic career scenarios. Make real-time decisions under pressure." },
              { step: "03", title: "Process behavioral data", description: "AI analyzes your decisions: risk tolerance, thinking patterns, leadership style." },
              { step: "04", title: "Generate career map", description: "Receive ranked career matches and a personalized roadmap to success." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div className="text-3xl font-bold text-indigo-500/40 group-hover:text-indigo-500/60 transition-colors font-mono">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SIMULATION PREVIEW ───────────────────────────────────────────── */}
      <Section id="simulation" className="relative py-24 px-8 md:px-20">
        <AnimatedGrid />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Example</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Inside a <span className="text-slate-500">career simulation.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24"
            >
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
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
                <h3 className="text-2xl font-bold text-white mb-3">
                  You're not answering a quiz.
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Every decision you make in a simulation is analyzed against thousands of data
                  points. The system doesn't ask "What do you prefer?" It observes "How did you
                  actually decide?"
                </p>
              </div>

              <div className="border-t border-slate-700/50 pt-6">
                <h4 className="text-base font-bold text-white mb-4">What we measure:</h4>
                <ul className="space-y-3">
                  {[
                    "Risk tolerance in high-pressure decisions",
                    "Analytical vs. intuitive thinking patterns",
                    "Leadership style under uncertainty",
                    "Creative vs. systematic problem-solving",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── RESULTS ──────────────────────────────────────────────────────── */}
      <Section className="relative py-24 px-8 md:px-20 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent">
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-4">Outcomes</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Your career <span className="text-slate-500">blueprint.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                <h3 className="text-2xl font-bold text-white mb-3">
                  Data-backed career recommendations.
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  No generic personality types. No vague percentages. You get ranked career matches
                  based on how you actually performed in realistic scenarios.
                </p>
              </div>
              <div className="border-t border-slate-700/50 pt-6">
                <h4 className="text-base font-bold text-white mb-4">You'll receive:</h4>
                <div className="space-y-3">
                  {[
                    "Top 5 career matches ranked by fit",
                    "Detailed trait analysis (radar chart)",
                    "Personalized learning roadmap",
                    "Internship & project recommendations",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                      <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24"
            >
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6">
                <ResultsPreview />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA — ONE primary action ───────────────────────────────── */}
      <Section className="relative py-24 px-8 md:px-20">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden p-12 md:p-16"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.2) 0%, transparent 60%), rgba(99, 102, 241, 0.05)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"
            />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to discover{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  your career fit
                </span>
                <span className="text-slate-500">?</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
                18 minutes. Real scenarios. Data-backed insights. Join 2,400+ students who already
                know their next move.
              </p>
              {/* Single primary CTA */}
              <Link href="/onboarding">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99, 102, 241, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-[15px] transition-all duration-200 shadow-lg"
                >
                  Start Simulation
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-slate-800/50 px-8 md:px-20 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">PathPilot</span>
          </div>
          <p className="text-sm text-slate-500">Career discovery through behavioral simulation.</p>
          <p className="text-xs text-slate-600">© 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
