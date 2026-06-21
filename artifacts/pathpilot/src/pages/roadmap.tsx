import { useGetRoadmap } from "@workspace/api-client-react";
import { Book, Zap, Code, Award, Trophy, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Roadmap() {
  const { data: roadmap, isLoading } = useGetRoadmap();

  if (isLoading) return <div className="text-muted-foreground">Loading roadmap...</div>;
  if (!roadmap) return <div className="text-muted-foreground">Complete simulations to unlock your roadmap.</div>;

  const iconMap: Record<string, React.ReactNode> = {
    course: <Book className="w-5 h-5 text-blue-500" />,
    skill: <Zap className="w-5 h-5 text-yellow-500" />,
    project: <Code className="w-5 h-5 text-primary" />,
    certification: <Award className="w-5 h-5 text-purple-500" />,
    competition: <Trophy className="w-5 h-5 text-orange-500" />,
    experience: <Briefcase className="w-5 h-5 text-green-500" />,
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <span className="text-sm font-bold text-primary uppercase tracking-wider">Your Path To</span>
        <h1 className="text-4xl font-bold tracking-tight">{roadmap.targetCareer}</h1>
      </div>

      <div className="space-y-12 pt-8">
        {roadmap.phases.map((phase, i) => {
          // Find milestones for this timeframe
          const phaseMilestones = roadmap.milestones.filter(m => m.timeframe === phase.timeframe);
          
          return (
            <div key={i} className="relative">
              <div className="sticky top-20 z-10 bg-background/95 backdrop-blur py-4 border-b border-border/40 mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-4">
                  <span className="text-muted-foreground font-mono text-lg opacity-50">0{i+1}</span>
                  {phase.name}
                </h2>
                <p className="text-primary text-sm font-medium mt-1">{phase.timeframe} — {phase.focus}</p>
              </div>

              <div className="space-y-4 pl-4 border-l border-border/40 ml-4">
                {phaseMilestones.map(milestone => (
                  <Card key={milestone.id} className="relative border-border/60 ml-6">
                    <div className="absolute -left-10 top-6 w-8 h-[1px] bg-border/40" />
                    <div className="absolute -left-12 top-4 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                      {iconMap[milestone.type]}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold ${
                          milestone.priority === 'essential' ? 'text-red-500 bg-red-500/10' :
                          milestone.priority === 'recommended' ? 'text-blue-500 bg-blue-500/10' :
                          'text-muted-foreground bg-muted'
                        }`}>
                          {milestone.priority}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{milestone.type}</span>
                      </div>
                      <CardTitle className="text-xl mt-2">{milestone.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{milestone.description}</p>
                      {milestone.resources && milestone.resources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/40">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Resources</span>
                          <ul className="space-y-1">
                            {milestone.resources.map((res, j) => (
                              <li key={j} className="text-sm text-primary flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary" /> {res}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}