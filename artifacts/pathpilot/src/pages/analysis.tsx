import { useParams, Link } from "wouter";
import { useGetSessionAnalysis } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

export default function Analysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const id = parseInt(sessionId || "0", 10);

  const { data: analysis, isLoading } = useGetSessionAnalysis(id, {
    query: { enabled: !!id }
  });

  if (isLoading) return <div className="text-muted-foreground">Loading analysis...</div>;
  if (!analysis) return null;

  const chartData = [{ name: 'Confidence', value: analysis.confidenceScore, fill: 'var(--primary)' }];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Your Career Analysis</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Based on your decisions in the simulation, here is what we discovered about your professional inclinations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Primary Match</span>
            <CardTitle className="text-3xl">{analysis.primaryCareer}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{analysis.summary}</p>
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Secondary Match</span>
              <p className="font-medium">{analysis.secondaryCareer}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Confidence Score</h3>
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={chartData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold font-mono">{analysis.confidenceScore}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strengths Displayed</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Areas for Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.growthAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 pt-6 justify-center">
        <Link href="/opportunities">
          <Button size="lg">Explore Opportunities</Button>
        </Link>
        <Link href="/roadmap">
          <Button size="lg" variant="outline">View Roadmap</Button>
        </Link>
      </div>
    </div>
  );
}