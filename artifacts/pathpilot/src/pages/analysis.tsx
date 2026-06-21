import { useParams, Link } from "wouter";
import { useGetSessionAnalysis } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Analysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const id = parseInt(sessionId || "0", 10);
  const { data: analysis, isLoading } = useGetSessionAnalysis(id, { query: { enabled: !!id } });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!analysis) return (
    <div className="text-center py-24 text-muted-foreground">Analysis not found.</div>
  );

  const chartData = [{ name: "Confidence", value: analysis.confidenceScore, fill: "hsl(var(--primary))" }];

  const score = analysis.confidenceScore;
  const scoreColor = score >= 80 ? "#10b981" : score >= 65 ? "#6366f1" : "#f59e0b";

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" /> Simulation complete
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Your career analysis</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Based on your decisions and behavioral patterns across all stages of the simulation.
        </p>
      </motion.div>

      {/* Primary match + score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div
          variants={fadeUp}
          custom={1}
          className="md:col-span-2 relative rounded-2xl p-7 overflow-hidden border border-primary/25 bg-primary/5"
        >
          <div className="absolute top-0 right-0 w-48 h-48 opacity-20 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent)", transform: "translate(25%,-25%)" }} />
          <div className="relative">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Primary match</p>
            <h2 className="text-3xl font-bold text-foreground mb-3">{analysis.primaryCareer}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{analysis.summary}</p>
            <div className="border-t border-border/40 pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Secondary match</p>
              <p className="font-semibold text-foreground">{analysis.secondaryCareer}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={2}
          className="rounded-2xl p-6 border border-border/60 bg-card flex flex-col items-center justify-center text-center"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Match confidence</p>
          <div className="h-36 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={16} data={chartData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background clockWise dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-mono" style={{ color: scoreColor }}>{analysis.confidenceScore}%</span>
              <span className="text-xs text-muted-foreground mt-1">confidence</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Behavioral insights */}
      {analysis.behavioralInsights && analysis.behavioralInsights.length > 0 && (
        <motion.div variants={fadeUp} custom={3} className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Behavioral insights
          </h3>
          <div className="space-y-3">
            {analysis.behavioralInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary text-[10px] font-bold">{i + 1}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Strengths + Growth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div variants={fadeUp} custom={4} className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Strengths displayed
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span className="text-foreground">{str}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} custom={5} className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-500" /> Areas for growth
          </h3>
          <ul className="space-y-3">
            {analysis.growthAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span className="text-foreground">{area}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* CTA — next steps */}
      <motion.div
        variants={fadeUp}
        custom={6}
        className="relative rounded-2xl p-8 overflow-hidden border border-primary/20 bg-primary/5"
      >
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">What's next?</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Your analysis is ready — now explore real opportunities matched to your career match, then get your personalized AI roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/opportunities">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(139,92,246,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm"
                style={{ boxShadow: "0 0 25px rgba(139,92,246,0.3)" }}
              >
                Explore opportunities <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/roadmap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-accent transition-colors"
              >
                View my roadmap <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
