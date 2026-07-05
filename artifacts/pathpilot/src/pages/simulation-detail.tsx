import { useParams, useLocation } from "wouter";
import { useGetSimulation, useCreateSimulationSession, getGetSimulationQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Clock, Play, BarChart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
  SystemCard,
  SystemCardHeader,
  SystemCardTitle,
  SystemCardDescription,
  SystemCardContent,
  SystemCardActions,
} from "@/components/system-card";
import { StateLabel } from "@/components/state-label";

function difficultyState(difficulty: string): "stable" | "evolving" | "high-risk" {
  if (difficulty === "beginner" || difficulty === "easy") return "stable";
  if (difficulty === "intermediate" || difficulty === "medium") return "evolving";
  return "high-risk";
}

export default function SimulationDetail() {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();

  const { data: simulation, isLoading } = useGetSimulation(numericId, {
    query: { enabled: !!numericId, queryKey: getGetSimulationQueryKey(numericId) },
  });

  const createSession = useCreateSimulationSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  if (!simulation) {
    return <div className="text-destructive text-sm">Simulation not found.</div>;
  }

  const handleStart = () => {
    createSession.mutate(
      { data: { simulationId: numericId } },
      { onSuccess: (session) => setLocation(`/simulate/${session.id}`) }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl"
    >
      {/* Cover accent */}
      <div
        className="w-full h-32 rounded-2xl opacity-20"
        style={{ backgroundColor: simulation.coverColor || "var(--color-primary)" }}
      />

      {/* Title block */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-zinc-400">
            {simulation.careerCategory}
          </span>
          <StateLabel variant={difficultyState(simulation.difficulty)} />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{simulation.title}</h1>
        <p className="text-zinc-400 text-base">{simulation.tagline}</p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 py-4 border-y border-white/[0.06]">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium">{simulation.estimatedMinutes} mins</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <BarChart className="w-4 h-4 text-primary" />
          <span className="font-medium capitalize">{simulation.difficulty}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs bg-white/[0.05] px-2 py-1 rounded">{simulation.stages} Stages</span>
        </div>
      </div>

      {/* About card */}
      <SystemCard>
        <SystemCardHeader>
          <SystemCardTitle>About this simulation</SystemCardTitle>
        </SystemCardHeader>
        <SystemCardContent>
          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
            {simulation.description}
          </p>
        </SystemCardContent>
      </SystemCard>

      {/* Skills card */}
      <SystemCard>
        <SystemCardHeader>
          <SystemCardTitle>Skills you will test</SystemCardTitle>
          <SystemCardDescription>Behavioral traits measured by your decisions</SystemCardDescription>
        </SystemCardHeader>
        <SystemCardContent>
          <div className="flex flex-wrap gap-2">
            {simulation.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs border border-white/[0.08] px-3 py-1.5 rounded-lg text-zinc-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </SystemCardContent>
        <SystemCardActions>
          <Button
            size="sm"
            className="px-8"
            onClick={handleStart}
            disabled={createSession.isPending}
          >
            <Play className="w-4 h-4 mr-2" />
            {createSession.isPending ? "Initializing…" : "Begin Simulation"}
          </Button>
        </SystemCardActions>
      </SystemCard>
    </motion.div>
  );
}
