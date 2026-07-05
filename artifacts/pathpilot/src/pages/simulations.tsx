import { useListSimulations } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Clock, BarChart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
  SystemCard,
  SystemCardHeader,
  SystemCardTitle,
  SystemCardDescription,
  SystemCardContent,
  SystemCardMeta,
  SystemCardActions,
} from "@/components/system-card";
import { StateLabel } from "@/components/state-label";

// Map difficulty to state label variant
function difficultyState(difficulty: string): "stable" | "evolving" | "high-risk" {
  if (difficulty === "beginner" || difficulty === "easy") return "stable";
  if (difficulty === "intermediate" || difficulty === "medium") return "evolving";
  return "high-risk";
}

export default function Simulations() {
  const { data: simulations, isLoading } = useListSimulations();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5" />
          Simulation Library
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Simulations</h1>
        <p className="text-muted-foreground text-sm">
          Experience different career paths through realistic, high-stakes scenarios.
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-primary/5 border border-border/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simulations?.map((sim, i) => (
            <motion.div
              key={sim.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <SystemCard className="hover:border-primary/30 transition-colors h-full">
                {/* Color accent bar */}
                <div
                  className="h-1.5 w-full flex-shrink-0"
                  style={{ backgroundColor: sim.coverColor || "var(--color-primary)", opacity: 0.6 }}
                />

                <SystemCardHeader
                  badge={<StateLabel variant={difficultyState(sim.difficulty)} />}
                >
                  {/* Category chip */}
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/5 text-muted-foreground mb-2">
                    {sim.careerCategory}
                  </span>
                  <SystemCardTitle className="text-base">{sim.title}</SystemCardTitle>
                  {sim.tagline && (
                    <SystemCardDescription>{sim.tagline}</SystemCardDescription>
                  )}
                </SystemCardHeader>

                <SystemCardContent>
                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {sim.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] border border-border/40 px-2 py-0.5 rounded-md text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </SystemCardContent>

                <SystemCardMeta>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {sim.estimatedMinutes}m
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart className="w-3.5 h-3.5" />
                    {sim.difficulty}
                  </span>
                </SystemCardMeta>

                <SystemCardActions>
                  <Link href={`/simulations/${sim.id}`} className="w-full">
                    <Button size="sm" className="w-full">View Details</Button>
                  </Link>
                </SystemCardActions>
              </SystemCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
