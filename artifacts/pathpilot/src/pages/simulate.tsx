import { useParams, useLocation } from "wouter";
import { useGetSimulationSession, useSubmitDecision, getGetSimulationSessionQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Zap, BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function Simulate() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const id = parseInt(sessionId || "0", 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useGetSimulationSession(id, {
    query: {
      enabled: !!id,
      queryKey: getGetSimulationSessionQueryKey(id),
      refetchInterval: false,
    },
  });

  const submitDecision = useSubmitDecision();

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [lastConsequence, setLastConsequence] = useState("");
  const [showCitation, setShowCitation] = useState(false);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="font-mono text-sm">Initializing environment…</p>
        </div>
      </div>
    );
  }

  if (session.status === "completed" || session.currentStage > session.totalStages) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center">
            <Zap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold">Simulation Complete</h1>
          <p className="text-muted-foreground">Final Score: {session.score}</p>
          <Button size="lg" className="w-full" onClick={() => setLocation(`/analysis/${id}`)}>
            View Full Analysis
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowCitation(false);
    submitDecision.mutate(
      { sessionId: id, data: { choiceId, stageNumber: session.currentStage } },
      {
        onSuccess: (updatedSession) => {
          const decision = updatedSession.decisions.find(
            (d) => d.stageNumber === session.currentStage,
          );
          if (decision) setLastConsequence(decision.consequence);
          setShowConsequence(true);
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

  const currentScenario = session.currentScenario as (typeof session.currentScenario & { citation?: string }) | null;
  const progress = ((session.currentStage - 1) / session.totalStages) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">{session.simulationTitle || "Simulation"}</h2>
          <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2.5 py-1 rounded-full">
            Stage {session.currentStage} / {session.totalStages}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32">
            <Progress value={progress} className="h-1.5" />
          </div>
          <span className="text-sm font-mono text-primary">Score: {session.score}</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Live Metrics */}
        <div className="w-64 border-r border-border/40 p-6 bg-muted/10 overflow-y-auto flex-shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">Live Metrics</h3>
          <div className="space-y-6">
            <MetricGauge label="Analytical" value={session.metrics.analyticalThinking || 0} />
            <MetricGauge label="Communication" value={session.metrics.communication || 0} />
            <MetricGauge label="Problem Solving" value={session.metrics.problemSolving || 0} />
            <MetricGauge label="Leadership" value={session.metrics.leadership || 0} />
            <MetricGauge label="Adaptability" value={session.metrics.adaptability || 0} />
          </div>
        </div>

        {/* Center Panel — Scenario */}
        <div className="flex-1 relative overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {!showConsequence && currentScenario ? (
                <motion.div
                  key={`scenario-${currentScenario.stageNumber}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Scenario header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                        Real-World Incident
                      </span>
                      {currentScenario.citation && (
                        <button
                          onClick={() => setShowCitation((v) => !v)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {showCitation ? "Hide source" : "View source"}
                        </button>
                      )}
                    </div>

                    <h1 className="text-3xl font-bold leading-tight">{currentScenario.title}</h1>

                    {/* Citation panel */}
                    <AnimatePresence>
                      {showCitation && currentScenario.citation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start gap-3 bg-muted/40 border border-border/60 rounded-xl px-4 py-3 text-xs text-muted-foreground">
                            <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/60" />
                            <p className="leading-relaxed">{currentScenario.citation}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="bg-muted/20 border border-border/40 rounded-xl p-5">
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-3">
                        Context
                      </p>
                      <p className="text-[15px] text-foreground/90 leading-relaxed">{currentScenario.context}</p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{currentScenario.description}</p>
                  </div>

                  {/* Choices */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Select a course of action:</h3>
                    {currentScenario.choices.map((choice) => (
                      <button
                        key={choice.id}
                        disabled={submitDecision.isPending}
                        onClick={() => handleChoice(choice.id)}
                        className={`w-full text-left p-6 rounded-xl border transition-all duration-200 
                          ${selectedChoice === choice.id
                            ? "border-primary bg-primary/5 shadow-[0_0_0_1px_rgba(99,102,241,0.3)]"
                            : "border-border/60 hover:border-primary/50 hover:bg-muted/50"
                          }
                        `}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-sm font-medium leading-relaxed">{choice.text}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-md font-mono flex-shrink-0 ${
                              choice.risk === "low"
                                ? "bg-green-500/10 text-green-500"
                                : choice.risk === "medium"
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            Risk: {choice.risk}
                          </span>
                        </div>
                        {submitDecision.isPending && selectedChoice === choice.id && (
                          <div className="mt-3">
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="consequence"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="bg-card border border-border p-8 rounded-2xl space-y-6"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Outcome</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{lastConsequence}</p>

                  {currentScenario?.citation && (
                    <div className="flex items-start gap-3 bg-muted/30 border border-border/40 rounded-xl px-4 py-3 text-xs text-muted-foreground">
                      <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/60" />
                      <p className="leading-relaxed">{currentScenario.citation}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button size="lg" className="w-full" onClick={handleContinue}>
                      Continue to Next Stage
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricGauge({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}
