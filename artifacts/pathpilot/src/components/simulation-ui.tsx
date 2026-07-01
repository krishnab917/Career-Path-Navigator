/**
 * ============================================================================
 * SIMULATION UI COMPONENT
 * ============================================================================
 *
 * React component that renders the simulation experience.
 * Handles user interactions, trait display, consequence logging, and
 * system-style UI feedback.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, BarChart3, Clock, Zap } from "lucide-react";
import { SimulationEngine, TraitVector } from "@/lib/simulation-engine";
import { SimulationScenario } from "@/lib/simulation-engine";

interface SimulationUIProps {
  scenario: SimulationScenario;
  onComplete?: (summary: any) => void;
}

interface SystemLog {
  id: string;
  type: "info" | "warning" | "critical" | "success";
  message: string;
  timestamp: number;
}

/**
 * SimulationUI Component
 *
 * Renders the interactive simulation experience with:
 * - Current scenario context and time pressure indicator
 * - Decision options with trait impact preview
 * - System log panel for consequences
 * - Live trait evolution visualization
 * - System-style microcopy and UI language
 */
export default function SimulationUI({ scenario, onComplete }: SimulationUIProps) {
  const engineRef = useRef<SimulationEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [availableOptions, setAvailableOptions] = useState<any[]>([]);
  const [userTraits, setUserTraits] = useState<TraitVector | null>(null);
  const [timePressure, setTimePressure] = useState(0);
  const [decisionCount, setDecisionCount] = useState(0);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Initialize simulation engine
  useEffect(() => {
    const engine = new SimulationEngine(scenario, `session-${Date.now()}`);
    engineRef.current = engine;

    const state = engine.getSessionState();
    setCurrentNode(state.current_node);
    setAvailableOptions(state.available_options);
    setUserTraits(state.user_traits);
    setTimePressure(state.time_pressure);

    addSystemLog(
      "info",
      `Initializing simulation: ${scenario.name}...`
    );
    addSystemLog("info", `Role: ${scenario.role}`);
    addSystemLog("info", `Environment: ${scenario.environment}`);

    setTimeout(() => {
      setIsLoading(false);
      addSystemLog("success", "System initialized. Ready for simulation.");
    }, 800);
  }, [scenario]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [systemLogs]);

  const addSystemLog = (
    type: "info" | "warning" | "critical" | "success",
    message: string
  ) => {
    setSystemLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        type,
        message,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleDecision = async (optionId: string) => {
    if (!engineRef.current) return;

    setSelectedOption(optionId);
    setIsProcessing(true);

    const option = availableOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const result = engineRef.current.makeDecision(optionId);

      // Log immediate consequence
      addSystemLog("info", `Processing decision: "${option.label}"`);
      
      setTimeout(() => {
        addSystemLog("warning", `System update: ${result.immediate_feedback}`);
      }, 400);

      // Log trait updates
      setTimeout(() => {
        const traitChanges = Object.entries(result.trait_updates)
          .filter(([, value]) => value !== 0)
          .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value > 0 ? "+" : ""}${value}`)
          .join(" | ");

        if (traitChanges) {
          addSystemLog("info", `Trait model updated: ${traitChanges}`);
        }
      }, 800);

      // Log delayed consequences
      result.delayed_consequences.forEach((msg, idx) => {
        setTimeout(() => {
          addSystemLog("critical", `System alert: ${msg}`);
        }, 1200 + idx * 400);
      });

      // Update UI state
      setTimeout(() => {
        const state = engineRef.current!.getSessionState();
        setCurrentNode(state.current_node);
        setAvailableOptions(state.available_options);
        setUserTraits(state.user_traits);
        setTimePressure(state.time_pressure);
        setDecisionCount(state.decision_count);
        setSelectedOption(null);
        setIsProcessing(false);

        if (state.is_complete) {
          finishSimulation();
        } else {
          addSystemLog("success", `Next scenario loaded: ${state.current_node.title}`);
        }
      }, 2000);
    } catch (error) {
      addSystemLog("critical", `System error: ${(error as Error).message}`);
      setIsProcessing(false);
    }
  };

  const finishSimulation = () => {
    setIsComplete(true);
    const engine = engineRef.current!;
    const summary = engine.generateSummary();

    addSystemLog("success", "Simulation completed. Generating final analysis...");

    setTimeout(() => {
      addSystemLog("info", "Trait analysis: Complete");
      addSystemLog("info", `Total decisions: ${summary.total_decisions}`);
      addSystemLog("info", `Duration: ${Math.round(summary.duration_seconds / 60)} minutes`);
      addSystemLog("success", "Analysis ready. Navigating to results...");

      if (onComplete) {
        setTimeout(() => onComplete(summary), 1500);
      }
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 mx-auto mb-4"
          />
          <p className="text-slate-400">Initializing simulation...</p>
        </motion.div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Error loading simulation</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 md:p-8">
      {/* ════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
          ════════════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header: Scenario Title & Time Pressure */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
                Decision Node {decisionCount + 1}
              </p>
              <h2 className="text-3xl font-bold text-white">{currentNode.title}</h2>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Pressure</span>
              </div>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${timePressure * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${
                    timePressure > 0.75
                      ? "bg-red-500"
                      : timePressure > 0.5
                      ? "bg-amber-500"
                      : "bg-indigo-500"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Context */}
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            {currentNode.context}
          </p>
        </motion.div>

        {/* Decision Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2">
            Available Options
          </p>

          {availableOptions.map((option, idx) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              onClick={() => handleDecision(option.id)}
              disabled={isProcessing}
              className={`w-full text-left group transition-all ${
                selectedOption === option.id ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              <div
                className={`bg-slate-900/60 border border-slate-700/50 rounded-lg p-5 hover:bg-slate-900/80 hover:border-indigo-500/50 transition-all ${
                  isProcessing && selectedOption !== option.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                      selectedOption === option.id
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {option.label}
                    </h3>
                    {option.description && (
                      <p className="text-sm text-slate-400 mb-3">
                        {option.description}
                      </p>
                    )}

                    {/* Trait Impact Preview */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(option.trait_effects)
                        .filter(([, value]) => value !== 0)
                        .map(([key, value]) => (
                          <span
                            key={key}
                            className={`text-xs px-2 py-1 rounded ${
                              (value as number) > 0
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {key.replace(/_/g, " ")} {(value as number) > 0 ? "+" : ""}{value}
                          </span>
                        ))}
                    </div>
                  </div>

                  {isProcessing && selectedOption === option.id && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="shrink-0"
                    >
                      <Zap className="w-5 h-5 text-indigo-400" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SIDEBAR: TRAITS & SYSTEM LOG
          ════════════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-1 space-y-6">
        {/* Trait Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-5 sticky top-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Trait Model</h3>
          </div>

          <div className="space-y-4">
            {userTraits &&
              Object.entries(userTraits).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-bold text-white">{Math.round(value)}</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: "50%" }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">
              Baseline: 50 | Max: 100 | Min: 0
            </p>
          </div>
        </motion.div>

        {/* System Log Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-5 flex flex-col h-80"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            System Log
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 text-xs font-mono">
            <AnimatePresence>
              {systemLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-2 rounded border-l-2 ${
                    log.type === "info"
                      ? "border-l-slate-500 bg-slate-800/30 text-slate-400"
                      : log.type === "warning"
                      ? "border-l-amber-500 bg-amber-500/10 text-amber-300"
                      : log.type === "critical"
                      ? "border-l-red-500 bg-red-500/10 text-red-300"
                      : "border-l-green-500 bg-green-500/10 text-green-300"
                  }`}
                >
                  {log.message}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={logsEndRef} />
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          COMPLETION MODAL
          ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-700/50 rounded-lg p-8 max-w-md text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <Zap className="w-6 h-6 text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Simulation Complete
              </h2>
              <p className="text-slate-400 mb-6">
                Analyzing behavioral data and generating career profile...
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
