import { useGetDashboard } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetDashboard();

  if (isLoading) return <div className="text-muted-foreground">Loading dashboard...</div>;
  if (!dashboard) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here's your career progress.</p>
      </div>

      {!dashboard.profileComplete && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary">Complete your profile</h3>
              <p className="text-sm text-muted-foreground">Get personalized recommendations by completing onboarding.</p>
            </div>
            <Link href="/onboarding">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Simulations Completed</CardDescription>
            <CardTitle className="text-4xl font-mono">{dashboard.simulationsCompleted}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Score</CardDescription>
            <CardTitle className="text-4xl font-mono text-primary">{dashboard.totalScore || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Opportunities</CardDescription>
            <CardTitle className="text-4xl font-mono">{dashboard.activeOpportunities}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top Match</CardDescription>
            <CardTitle className="text-xl truncate">{dashboard.topCareerMatch || "Need more data"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.recentSessions?.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent sessions. Start a simulation to see it here.</p>
            )}
            {dashboard.recentSessions?.map(session => (
              <div key={session.id} className="flex justify-between items-center p-4 border rounded-xl">
                <div>
                  <h4 className="font-medium">{session.simulationTitle || "Simulation"}</h4>
                  <p className="text-xs text-muted-foreground">Status: {session.status}</p>
                </div>
                {session.status === 'completed' ? (
                  <Link href={`/analysis/${session.id}`}><Button variant="secondary" size="sm">Analysis</Button></Link>
                ) : (
                  <Link href={`/simulate/${session.id}`}><Button size="sm">Resume</Button></Link>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Roadmap Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span className="font-mono">{dashboard.roadmapProgress}%</span>
              </div>
              <Progress value={dashboard.roadmapProgress} className="h-2" />
            </div>
            <div className="mt-6">
              <Link href="/roadmap">
                <Button variant="outline" className="w-full">View Full Roadmap</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}