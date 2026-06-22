import { useParams, useLocation } from "wouter";
import { useGetSimulationSession, useSubmitDecision, getGetSimulationSessionQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, BookOpen, ExternalLink, AlertTriangle, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

type Scenario = {
  stageNumber: number;
  title: string;
  description: string;
  context: string;
  citation?: string;
  stakes?: string;
  timeLimit?: number;
  choices: { id: string; text: string; risk: "low" | "medium" | "high"; hint?: string }[];
};

export default function Simulate() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const id = parseInt(sessionId || "0", 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useGetSimulationSession(id, {
    query: { enabled: !!id, queryKey: getGetSimulationSessionQueryKey(id), refetchInterval: false },
  });

  const submitDecision = useSubmitDecision();

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [lastConsequence, setLastConsequence] = useState("");
  const [showCitation, setShowCitation] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const currentScenario = session?.currentScenario as (Scenario | null);

  // Timer
  useEffect(() => {
    if (currentScenario?.timeLimit && !showConsequence && session?.status === "active") {
      setTimeLeft(currentScenario.timeLimit);
      setTimerActive(true);
    }
  }, [currentScenario?.stageNumber, showConsequence]);

  useEffect(() => {
    if (!timerActive || timeLeft === null) return;
    if (timeLeft <= 0) { setTimerActive(false); return; }
    const t = setTimeout(() => setTimeLeft((v) => (v ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060606]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Initializing simulation environment…</p>
        </div>
      </div>
    );
  }

  if (session.status === "completed" || session.currentStage > session.totalStages) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#060606]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center space-y-6 px-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center">
            <Zap className="w-10 h-10" />
          </div>
          <div>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Simulation Complete</p>
            <h1 className="text-4xl font-bold text-white">Score: {session.score}</h1>
            <p className="text-zinc-500 mt-2 text-sm">
              {session.score >= 80 ? "Exceptional performance. You made the right calls under pressure." :
               session.score >= 60 ? "Strong performance. Several decisions showed good instincts." :
               "Good effort. Review the analysis to understand the key decision points."}
            </p>
          </div>
          <Button size="lg" className="w-full" onClick={() => setLocation(`/analysis/${id}`)}>
            View Full Analysis →
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setTimerActive(false);
    submitDecision.mutate(
      { sessionId: id, data: { choiceId, stageNumber: session.currentStage } },
      {
        onSuccess: (updatedSession) => {
          const decision = updatedSession.decisions.find((d) => d.stageNumber === session.currentStage);
          if (decision) setLastConsequence(decision.consequence);
          setShowConsequence(true);
          setShowCitation(false);
          queryClient.setQueryData(getGetSimulationSessionQueryKey(id), updatedSession);
        },
      },
    );
  };

  const handleContinue = () => {
    setShowConsequence(false);
    setSelectedChoice(null);
    setShowCitation(false);
  };

  const progress = ((session.currentStage - 1) / session.totalStages) * 100;
  const metrics = session.metrics;
  const timerPct = currentScenario?.timeLimit && timeLeft !== null ? (timeLeft / currentScenario.timeLimit) * 100 : 100;
  const timerUrgent = timeLeft !== null && timeLeft < 30;

  return (
    <div className="min-h-screen flex flex-col bg-[#060606]">
      {/* Top bar */}
      <header className="border-b border-white/[0.05] px-6 py-3 flex items-center justify-between bg-[#080808]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Live Simulation</span>
          </div>
          <span className="text-zinc-700">·</span>
          <span className="text-sm font-medium text-zinc-300">{session.simulationTitle}</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-zinc-600">Stage</span>
            <span className="text-white font-bold">{session.currentStage}<span className="text-zinc-600">/{session.totalStages}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 font-mono">Score</span>
            <span className="text-primary font-bold font-mono">{session.score}</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/[0.04] w-full">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-violet-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar — metrics */}
        <div className="w-56 border-r border-white/[0.04] p-5 bg-[#080808] overflow-y-auto flex-shrink-0 hidden lg:flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-4">Live Metrics</p>
            <div className="space-y-4">
              {[
                { label: "Analytical", val: metrics.analyticalThinking ?? 0, color: "#6366f1" },
                { label: "Communication", val: metrics.communication ?? 0, color: "#8b5cf6" },
                { label: "Problem Solving", val: metrics.problemSolving ?? 0, color: "#06b6d4" },
                { label: "Leadership", val: metrics.leadership ?? 0, color: "#10b981" },
                { label: "Adaptability", val: metrics.adaptability ?? 0, color: "#f59e0b" },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-zinc-500">{label}</span>
                    <span className="text-xs font-mono text-zinc-400">{val}</span>
                  </div>
                  <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          {currentScenario?.timeLimit && !showConsequence && timeLeft !== null && (
            <div className={`rounded-xl border p-3 transition-colors ${timerUrgent ? "border-red-500/40 bg-red-500/5" : "border-white/[0.06] bg-white/[0.02]"}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Time Pressure</p>
              <div className={`text-2xl font-bold font-mono ${timerUrgent ? "text-red-400" : "text-white"}`}>
                {Math.floor((timeLeft ?? 0) / 60).toString().padStart(2, "0")}:{((timeLeft ?? 0) % 60).toString().padStart(2, "0")}
              </div>
              <div className="mt-2 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-colors ${timerUrgent ? "bg-red-500" : "bg-primary"}`}
                  animate={{ width: `${timerPct}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1.5">Real incident timer</p>
            </div>
          )}
        </div>

        {/* Center — scenario */}
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {!showConsequence && currentScenario ? (
                <motion.div
                  key={`scenario-${currentScenario.stageNumber}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-7"
                >
                  {/* Stage label */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                        Stage {currentScenario.stageNumber} of {session.totalStages}
                      </span>
                      <span className="text-xs text-zinc-600 font-medium uppercase tracking-wider">Real-World Incident</span>
                    </div>
                    {currentScenario.citation && (
                      <button
                        onClick={() => setShowCitation((v) => !v)}
                        className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {showCitation ? "Hide source" : "Source"}
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h1 className="text-3xl font-bold text-white leading-tight mb-3">{currentScenario.title}</h1>

                    {/* Citation */}
                    <AnimatePresence>
                      {showCitation && currentScenario.citation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mb-3"
                        >
                          <div className="flex items-start gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-zinc-500 leading-relaxed">
                            <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/50" />
                            {currentScenario.citation}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Stakes — the key addition */}
                  {currentScenario.stakes && (
                    <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">What's at stake</p>
                        <p className="text-sm text-amber-200/80 leading-relaxed">{currentScenario.stakes}</p>
                      </div>
                    </div>
                  )}

                  {/* Context */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">Situation Briefing</p>
                    <p className="text-[15px] text-zinc-200 leading-relaxed">{currentScenario.context}</p>
                  </div>

                  {/* The scenario */}
                  <p className="text-zinc-400 leading-relaxed text-[15px]">{currentScenario.description}</p>

                  {/* Choices */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Select your course of action</p>
                    {currentScenario.choices.map((choice, i) => (
                      <motion.button
                        key={choice.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        disabled={submitDecision.isPending}
                        onClick={() => handleChoice(choice.id)}
                        className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group relative
                          ${selectedChoice === choice.id
                            ? "border-primary/60 bg-primary/8 shadow-[0_0_0_1px_rgba(99,102,241,0.25)]"
                            : "border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03]"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold font-mono transition-colors
                              ${selectedChoice === choice.id ? "bg-primary text-white" : "bg-white/[0.06] text-zinc-500 group-hover:bg-white/[0.1] group-hover:text-zinc-300"}
                            `}>
                              {choice.id.toUpperCase()}
                            </div>
                            <span className="text-sm text-zinc-200 leading-relaxed">{choice.text}</span>
                          </div>
                          <div className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            choice.risk === "low"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : choice.risk === "medium"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {choice.risk} risk
                          </div>
                        </div>
                        {submitDecision.isPending && selectedChoice === choice.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* Consequence screen */
                <motion.div
                  key="consequence"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">Decision Outcome</p>
                      <p className="text-lg font-bold text-white">Stage {session.currentStage} Complete</p>
                    </div>
                  </div>

                  {/* Consequence */}
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" /> What Happened
                    </p>
                    <p className="text-lg text-zinc-200 leading-relaxed">{lastConsequence}</p>
                  </div>

                  {/* Citation on outcome */}
                  {currentScenario?.citation && (
                    <div className="flex items-start gap-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 text-xs text-zinc-600 leading-relaxed">
                      <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/40" />
                      {currentScenario.citation}
                    </div>
                  )}

                  {/* Score delta preview */}
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
                    <div>
                      <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">Running Score</p>
                      <p className="text-2xl font-bold font-mono text-primary">{session.score}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-600">Stages remaining</p>
                      <p className="text-xl font-bold text-white">{session.totalStages - session.currentStage}</p>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleContinue}>
                    {session.currentStage >= session.totalStages ? "View Full Analysis →" : "Continue to Next Stage →"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right sidebar — context hints (desktop only) */}
        <div className="w-52 border-l border-white/[0.04] p-5 bg-[#080808] overflow-y-auto flex-shrink-0 hidden xl:flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Decision Guide</p>
          {!showConsequence && currentScenario?.choices.map((choice) => (
            <div key={choice.id} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono text-zinc-500 w-4">{choice.id.toUpperCase()}</span>
                <div className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  choice.risk === "low" ? "bg-emerald-500/15 text-emerald-500" :
                  choice.risk === "medium" ? "bg-amber-500/15 text-amber-500" :
                  "bg-red-500/15 text-red-500"
                }`}>{choice.risk}</div>
              </div>
              {choice.hint && (
                <p className="text-[11px] text-zinc-600 leading-relaxed pl-6">{choice.hint}</p>
              )}
            </div>
          ))}
          {showConsequence && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Learning Point</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Real professionals face these exact choices. Your decision pattern reveals your instincts under pressure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
