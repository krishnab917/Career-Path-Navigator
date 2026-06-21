import { useListOpportunities } from "@workspace/api-client-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Calendar, MapPin } from "lucide-react";

export default function Opportunities() {
  const [category, setCategory] = useState<string | null>(null);
  const { data: opportunities, isLoading } = useListOpportunities(category ? { category } : undefined);

  const categories = ["All", "Internship", "Research", "Scholarship", "Competition", "Hackathon", "Mentorship", "Summer Program"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground mt-2">Curated next steps based on your simulation results.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const val = cat === "All" ? null : cat.toLowerCase().replace(" ", "_");
          return (
            <Button 
              key={cat} 
              variant={category === val ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(val)}
            >
              {cat}
            </Button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading opportunities...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {opportunities?.map(opp => (
            <Card key={opp.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium uppercase tracking-wider">
                    {opp.category === 'summer_program' ? 'Summer Program' : opp.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-md border font-mono ${
                    opp.difficulty === 'high' ? 'border-red-500 text-red-500' :
                    opp.difficulty === 'medium' ? 'border-yellow-500 text-yellow-500' :
                    'border-green-500 text-green-500'
                  }`}>
                    {opp.difficulty} difficulty
                  </span>
                </div>
                <CardTitle className="text-xl">{opp.title}</CardTitle>
                <CardDescription>{opp.organization}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Match Score</span>
                    <span className="font-mono font-bold text-primary">{opp.relevanceScore}%</span>
                  </div>
                  <Progress value={opp.relevanceScore} className="h-1.5" />
                  <p className="text-sm text-muted-foreground pt-1">{opp.whyItMatches}</p>
                </div>
                <p className="text-sm line-clamp-3">{opp.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {new Date(opp.applicationDeadline).toLocaleDateString()}
                  </div>
                  {opp.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {opp.location}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border">
                {opp.url ? (
                  <Button className="w-full" variant="outline" asChild>
                    <a href={opp.url} target="_blank" rel="noreferrer">
                      View Application <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full" disabled variant="secondary">Application Closed</Button>
                )}
              </CardFooter>
            </Card>
          ))}
          {opportunities?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No opportunities found for this category right now.
            </div>
          )}
        </div>
      )}
    </div>
  );
}