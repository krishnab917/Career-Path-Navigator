import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateProfile, useCreateSimulationSession } from "@workspace/api-client-react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "India", "Singapore",
  "UAE", "South Africa", "Nigeria", "Kenya", "Germany", "France", "Netherlands",
  "Sweden", "Switzerland", "New Zealand", "Ireland", "Pakistan", "Bangladesh",
  "Malaysia", "Hong Kong", "Japan", "South Korea", "Brazil", "Mexico", "Other",
];

const CURRICULA = [
  { label: "International Baccalaureate (IB)", value: "IB" },
  { label: "Advanced Placement (AP)", value: "AP" },
  { label: "A-Levels (UK / Cambridge)", value: "A-Levels" },
  { label: "IGCSE / GCSE", value: "IGCSE" },
  { label: "CBSE (India)", value: "CBSE" },
  { label: "ICSE (India)", value: "ICSE" },
  { label: "Australian HSC", value: "HSC" },
  { label: "Canadian High School", value: "Canadian" },
  { label: "French Baccalaureate", value: "French Bac" },
  { label: "German Abitur", value: "Abitur" },
  { label: "American High School Diploma", value: "US Diploma" },
  { label: "Other / Not Listed", value: "Other" },
];

const CAREER_PATHS = [
  { id: "tech", label: "Technology & Software", emoji: "💻", desc: "Build the digital world", color: "#6366f1", simId: 1 },
  { id: "medicine", label: "Medicine & Healthcare", emoji: "🏥", desc: "Save and improve lives", color: "#ef4444", simId: 2 },
  { id: "business", label: "Business & Entrepreneurship", emoji: "🚀", desc: "Build companies & ventures", color: "#f59e0b", simId: 3 },
  { id: "law", label: "Law & Policy", emoji: "⚖️", desc: "Shape rules & advocate", color: "#8b5cf6", simId: 1 },
  { id: "engineering", label: "Engineering & Design", emoji: "⚙️", desc: "Design physical systems", color: "#0ea5e9", simId: 1 },
  { id: "research", label: "Research & Science", emoji: "🔬", desc: "Discover what's unknown", color: "#10b981", simId: 2 },
  { id: "finance", label: "Finance & Economics", emoji: "📈", desc: "Move capital & markets", color: "#f97316", simId: 3 },
  { id: "arts", label: "Arts & Creative Media", emoji: "🎨", desc: "Create & communicate", color: "#ec4899", simId: 3 },
];

const SIM_NAMES: Record<number, { title: string; tag: string; color: string; time: string; desc: string }> = {
  1: { title: "Software Engineer", tag: "Technology", color: "#6366f1", time: "25 min", desc: "Debug production systems, lead code reviews, and make architecture decisions that affect millions of users." },
  2: { title: "Emergency Medicine Physician", tag: "Healthcare", color: "#ef4444", time: "30 min", desc: "Triage critical patients, make high-stakes diagnostic decisions, and coordinate a fast-moving ER team." },
  3: { title: "Startup Founder", tag: "Entrepreneurship", color: "#f59e0b", time: "30 min", desc: "Pitch investors, navigate your first hires, and make pivotal product decisions with limited runway." },
};

const slide = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  animate: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -dir * 40 }),
};

const transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    country: "",
    curriculum: "",
    gradeLevel: "",
    careerInterests: [] as string[],
  });

  const createProfile = useCreateProfile();
  const createSession = useCreateSimulationSession();

  const advance = () => { setDir(1); setStep((s) => s + 1); };
  const back = () => { setDir(-1); setStep((s) => s - 1); };

  const toggleCareer = (id: string) => {
    setForm((f) => ({
      ...f,
      careerInterests: f.careerInterests.includes(id)
        ? f.careerInterests.filter((c) => c !== id)
        : [...f.careerInterests, id],
    }));
  };

  const recommendedSimId = (() => {
    for (const id of form.careerInterests) {
      const path = CAREER_PATHS.find((p) => p.id === id);
      if (path) return path.simId;
    }
    return 1;
  })();

  const handleStart = () => {
    const email = form.email || `${form.name.toLowerCase().replace(/\s+/g, ".")}.${Date.now()}@demo.pathpilot.ai`;
    createProfile.mutate({
      data: {
        name: form.name,
        email,
        age: form.age ? parseInt(form.age) : undefined,
        country: form.country || undefined,
        curriculum: form.curriculum || undefined,
        gradeLevel: form.gradeLevel || undefined,
        careerInterests: form.careerInterests,
      },
    }, {
      onSuccess: () => {
        createSession.mutate({ data: { simulationId: recommendedSimId } }, {
          onSuccess: (session) => {
            setLocation(`/simulate/${session.id}`);
          },
        });
      },
    });
  };

  const steps = ["You", "Education", "Interests", "Your Simulation"];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-8 h-14 border-b border-white/6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white font-bold text-xs">P</div>
          <span className="font-semibold text-sm text-white/70">PathPilot</span>
        </div>
        {/* Step indicator */}
        <div className="hidden md:flex items-center gap-2">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 text-xs transition-colors ${i <= step ? "text-white" : "text-white/25"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  i < step ? "bg-primary border-primary text-white" :
                  i === step ? "border-primary text-primary" :
                  "border-white/20 text-white/25"
                }`}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span>{label}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-px w-8 transition-colors ${i < step ? "bg-primary/50" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>
        <div className="text-xs text-white/25">{step + 1} / {steps.length}</div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={dir}>
            {/* STEP 0 — Identity */}
            {step === 0 && (
              <motion.div key="step0" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" transition={transition} className="space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Step 1 — About you</p>
                  <h1 className="text-4xl font-bold leading-tight">Let's start with <span style={{ color: "#a78bfa" }}>the basics</span>.</h1>
                  <p className="text-white/40 mt-3 text-[15px]">We'll use this to personalize your experience.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Full name</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-[15px] outline-none focus:border-primary/60 transition-colors"
                      placeholder="Alex Johnson"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-[15px] outline-none focus:border-primary/60 transition-colors"
                      placeholder="alex@school.edu"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Age</label>
                    <input
                      type="number"
                      min={12}
                      max={25}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-[15px] outline-none focus:border-primary/60 transition-colors"
                      placeholder="17"
                      value={form.age}
                      onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={advance}
                  disabled={!form.name.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-[15px] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                  style={{ boxShadow: "0 0 30px rgba(139,92,246,0.3)" }}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* STEP 1 — Education */}
            {step === 1 && (
              <motion.div key="step1" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" transition={transition} className="space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Step 2 — Your education</p>
                  <h1 className="text-4xl font-bold leading-tight">Where are you <span style={{ color: "#a78bfa" }}>studying</span>?</h1>
                  <p className="text-white/40 mt-3 text-[15px]">We tailor opportunities to your location and curriculum.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Country</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none focus:border-primary/60 transition-colors appearance-none"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      value={form.country}
                      onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    >
                      <option value="" style={{ background: "#111" }}>Select your country...</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} style={{ background: "#111" }}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Curriculum</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CURRICULA.map((c) => (
                        <motion.button
                          key={c.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setForm((f) => ({ ...f, curriculum: c.value }))}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                            form.curriculum === c.value
                              ? "border-primary bg-primary/15 text-white"
                              : "border-white/8 bg-white/3 text-white/50 hover:border-white/20 hover:text-white/80"
                          }`}
                        >
                          {form.curriculum === c.value && <Check className="w-3 h-3 inline mr-1 text-primary" />}
                          {c.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Current grade / year <span className="text-white/20 normal-case">(optional)</span></label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-[15px] outline-none focus:border-primary/60 transition-colors"
                      placeholder="e.g. Grade 11, Year 12, 11th Grade"
                      value={form.gradeLevel}
                      onChange={(e) => setForm((f) => ({ ...f, gradeLevel: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button onClick={back} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-[15px] font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={advance}
                    disabled={!form.country || !form.curriculum}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3.5 rounded-xl bg-primary text-white font-semibold text-[15px] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ boxShadow: "0 0 30px rgba(139,92,246,0.3)" }}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Career interests */}
            {step === 2 && (
              <motion.div key="step2" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" transition={transition} className="space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Step 3 — Career interests</p>
                  <h1 className="text-4xl font-bold leading-tight">What paths <span style={{ color: "#a78bfa" }}>excite you</span>?</h1>
                  <p className="text-white/40 mt-3 text-[15px]">Pick everything that sounds interesting — we'll find your best match.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {CAREER_PATHS.map((path) => {
                    const selected = form.careerInterests.includes(path.id);
                    return (
                      <motion.button
                        key={path.id}
                        onClick={() => toggleCareer(path.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-4 rounded-2xl border text-left transition-all group ${
                          selected ? "border-primary/60 bg-primary/10" : "border-white/8 bg-white/3 hover:border-white/20"
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="text-2xl mb-2">{path.emoji}</div>
                        <div className={`text-sm font-semibold mb-0.5 transition-colors ${selected ? "text-white" : "text-white/70 group-hover:text-white/90"}`}>
                          {path.label}
                        </div>
                        <div className="text-xs text-white/30">{path.desc}</div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <motion.button onClick={back} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center px-5 py-3.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={advance}
                    disabled={form.careerInterests.length === 0}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3.5 rounded-xl bg-primary text-white font-semibold text-[15px] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ boxShadow: "0 0 30px rgba(139,92,246,0.3)" }}
                  >
                    See my recommendation <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Recommended simulation */}
            {step === 3 && (
              <motion.div key="step3" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" transition={transition} className="space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Step 4 — Your match</p>
                  <h1 className="text-4xl font-bold leading-tight">Your recommended <span style={{ color: "#a78bfa" }}>simulation</span>.</h1>
                  <p className="text-white/40 mt-3 text-[15px]">
                    Based on your interests, we matched you to the simulation most likely to reveal your fit.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-3xl p-8 overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 70% 20%, ${SIM_NAMES[recommendedSimId].color}30, transparent 60%), rgba(255,255,255,0.04)`,
                    border: `1px solid ${SIM_NAMES[recommendedSimId].color}40`,
                  }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
                    style={{ background: `radial-gradient(circle, ${SIM_NAMES[recommendedSimId].color}, transparent)`, transform: "translate(30%,-30%)" }} />

                  <div className="relative">
                    <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider"
                      style={{ background: `${SIM_NAMES[recommendedSimId].color}25`, color: SIM_NAMES[recommendedSimId].color }}>
                      {SIM_NAMES[recommendedSimId].tag}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">{SIM_NAMES[recommendedSimId].title}</h2>
                    <p className="text-white/50 text-[15px] leading-relaxed mb-6">{SIM_NAMES[recommendedSimId].desc}</p>

                    <div className="flex items-center gap-6 text-sm text-white/35 border-t border-white/10 pt-6">
                      <span>5 stages</span>
                      <span>·</span>
                      <span>{SIM_NAMES[recommendedSimId].time}</span>
                      <span>·</span>
                      <span>Behavioral analysis included</span>
                    </div>
                  </div>
                </motion.div>

                <div className="bg-white/3 rounded-2xl p-5 border border-white/8">
                  <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3">Your profile summary</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-white/30">Name</span>
                      <p className="text-white font-medium">{form.name}</p>
                    </div>
                    <div>
                      <span className="text-white/30">Age</span>
                      <p className="text-white font-medium">{form.age || "—"}</p>
                    </div>
                    <div>
                      <span className="text-white/30">Country</span>
                      <p className="text-white font-medium">{form.country}</p>
                    </div>
                    <div>
                      <span className="text-white/30">Curriculum</span>
                      <p className="text-white font-medium">{form.curriculum}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-white/30 text-sm">Interests</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {form.careerInterests.map((id) => {
                        const path = CAREER_PATHS.find((p) => p.id === id);
                        return path ? (
                          <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-white/8 text-white/60">{path.emoji} {path.label}</span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button onClick={back} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center px-5 py-3.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={handleStart}
                    disabled={createProfile.isPending || createSession.isPending}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(139,92,246,0.6)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-4 rounded-xl bg-primary text-white font-bold text-[16px] flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ boxShadow: "0 0 40px rgba(139,92,246,0.4)" }}
                  >
                    {createProfile.isPending || createSession.isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Launching...
                      </span>
                    ) : (
                      <>Start simulation <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </div>
                <p className="text-xs text-white/20 text-center">You can explore other simulations from the dashboard after completing this one.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
