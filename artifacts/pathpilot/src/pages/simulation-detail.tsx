import { useParams, useLocation } from "wouter";
import { useGetSimulation, useCreateSimulationSession } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Clock, Play, BarChart } from "lucide-react";

export default function SimulationDetail() {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();

  const { data: simulation, isLoading } = useGetSimulation(numericId, {
    query: { enabled: !!numericId }
  });

  const createSession = useCreateSimulationSession();

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;
  if (!simulation) return <div className="text-destructive">Simulation not found</div>;

  const handleStart = () => {
    createSession.mutate({
      data: { simulationId: numericId }
    }, {
      onSuccess: (session) => {
        setLocation(`/simulate/${session.id}`);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div 
        className="w-full h-48 rounded-3xl mb-8 opacity-20"
        style={{ backgroundColor: simulation.coverColor || 'var(--primary)' }}
      />
      
      <div className="space-y-4">
        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
          {simulation.careerCategory}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold">{simulation.title}</h1>
        <p className="text-xl text-muted-foreground">{simulation.tagline}</p>
      </div>

      <div className="flex gap-6 py-6 border-y border-border">
        <div className="flex items-center gap-2">
          <Clock className="text-primary w-5 h-5" />
          <span className="font-medium">{simulation.estimatedMinutes} mins</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart className="text-primary w-5 h-5" />
          <span className="font-medium capitalize">{simulation.difficulty}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{simulation.stages} Stages</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">About this simulation</h3>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{simulation.description}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Skills you will test</h3>
        <div className="flex flex-wrap gap-2">
          {simulation.skills.map(skill => (
            <span key={skill} className="px-3 py-1.5 border border-border rounded-lg text-sm">{skill}</span>
          ))}
        </div>
      </div>

      <div className="pt-8">
        <Button size="lg" className="w-full md:w-auto px-12 h-14 text-lg" onClick={handleStart} disabled={createSession.isPending}>
          <Play className="w-5 h-5 mr-2" />
          {createSession.isPending ? "Initializing..." : "Begin Simulation"}
        </Button>
      </div>
    </div>
  );
}