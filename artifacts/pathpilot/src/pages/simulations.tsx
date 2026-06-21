import { useListSimulations } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BarChart } from "lucide-react";

export default function Simulations() {
  const { data: simulations, isLoading } = useListSimulations();

  if (isLoading) return <div className="text-muted-foreground">Loading simulations...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulations</h1>
        <p className="text-muted-foreground mt-2">Experience different career paths through interactive scenarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations?.map(sim => (
          <Card key={sim.id} className="flex flex-col overflow-hidden hover:border-primary/50 transition-colors">
            <div className="h-24 opacity-20" style={{ backgroundColor: sim.coverColor || 'var(--primary)' }} />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
                  {sim.careerCategory}
                </span>
              </div>
              <CardTitle>{sim.title}</CardTitle>
              {sim.tagline && <p className="text-sm text-muted-foreground">{sim.tagline}</p>}
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {sim.estimatedMinutes}m</span>
                <span className="flex items-center gap-1"><BarChart className="w-4 h-4"/> {sim.difficulty}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sim.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="text-xs border border-border px-2 py-1 rounded-md">{skill}</span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/simulations/${sim.id}`} className="w-full">
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}