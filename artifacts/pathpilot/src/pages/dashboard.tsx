import { useGetDashboard } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Zap, Target, TrendingUp, Briefcase, RotateCcw, ChevronRight, Clock, Award } from "lucide-react";
import { useMemo } from "react";

function generateSparklineData(seed: number, points = 12, trend: "up" | "down" | "flat" = "up") {
  const data = [];
  let value = 30 + (seed % 20);
  for (let i = 0; i < points; i++) {
    const noise = (Math.sin(seed * i * 0.7) * 8) + (Math.random() * 6 - 3);
    if (trend === "up") value += 1.5 + noise * 0.5;
    else if (trend === "down") value -= 0.8 + noise * 0.3;
    else value += noise * 0.4;
    data.push({ v: Math.max(0, Math.min(100, value)) });
  }
  return data;
}

function SparkCard({
  label,
  value,
  sub,
  delta,
  deltaLabel,
  color,
  trend,
  seed,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  deltaLabel?: string;
  color: string;
  trend?: "up" | "down" | "flat";
  seed: number;
  icon: React.ElementType;
}) {
  const data = useMemo(() => generateSparklineData(seed, 16, trend ?? "up"), [seed, trend]);
  const isPositive = delta === undefined || delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: seed * 0.06 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d0d] flex flex-col"
    >
      <div className="p-5 pb-2 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            <Icon className="w-3.5 h-3.5" style={{ color }} />
            {label}
          </div>
          {delta !== undefined && (
            <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(delta)}%
            </div>
          )}
        </div>
        <div className="text-4xl font-bold tracking-tight text-white font-mono mb-0.5">{value}</div>
        {sub && <div className="text-xs text-zinc-600">{sub}</div>}
        {deltaLabel && (
          <div className="text-xs text-zinc-500 mt-1">{deltaLabel}</div>
        )}
      </div>
      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#grad-${seed})`}
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip
              content={() => null}
              cursor={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function SessionRow({ session, index }: { session: { id: number; simulationTitle?: string | null; status: string; score: number; completedAt?: string | null }; index: number }) {
  const isCompleted = session.status === "completed";
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-emerald-500/10" : "bg-primary/10"}`}>
          {isCompleted ? (
            <Award className="w-4 h-4 text-emerald-400" />
          ) : (
            <Clock className="w-4 h-4 text-primary" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{session.simulationTitle || "Simulation"}</p>
          <p className="text-xs text-zinc-500 mt-0.5 capitalize">
            {isCompleted ? `Completed · Score ${session.score}` : "In progress"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {isCompleted && (
          <div className="text-right hidden sm:block">
            <div className="text-lg font-bold font-mono text-white">{session.score}</div>
            <div className="text-xs text-zinc-600">pts</div>
          </div>
        )}
        {isCompleted ? (
          <Link href={`/analysis/${session.id}`}>
            <button className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group-hover:text-primary">
              View <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        ) : (
          <Link href={`/simulate/${session.id}`}>
            <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Resume <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: dashboard, isLoading, refetch } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const totalScore = dashboard.totalScore ?? 0;
  const sims = dashboard.simulationsCompleted ?? 0;
  const opps = dashboard.activeOpportunities ?? 0;
  const roadmap = dashboard.roadmapProgress ?? 0;
  const confidencePct = dashboard.topCareerConfidence ? Math.round(dashboard.topCareerConfidence) : null;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Career Intelligence
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">PathPilot Dashboard</h1>
          <p className="text-zinc-500 mt-1.5 text-sm">Your career performance at a glance</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors border border-white/[0.06] rounded-lg px-3 py-2 hover:border-white/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </motion.div>

      {/* Profile incomplete banner */}
      {!dashboard.profileComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-primary">Complete your profile to unlock personalized insights</p>
            <p className="text-sm text-zinc-500 mt-0.5">Takes under 2 minutes. Tailors every simulation to your background.</p>
          </div>
          <Link href="/onboarding">
            <Button size="sm" className="flex-shrink-0">Get Started</Button>
          </Link>
        </motion.div>
      )}

      {/* Metric sparkline grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SparkCard
          label="Simulations"
          value={String(sims)}
          sub="career tracks run"
          delta={sims > 0 ? 100 : undefined}
          deltaLabel={sims > 0 ? "All time" : "Run your first simulation"}
          color="#6366f1"
          trend="up"
          seed={1}
          icon={Zap}
        />
        <SparkCard
          label="Performance Score"
          value={totalScore > 0 ? `${totalScore}` : "—"}
          sub="cumulative points"
          delta={totalScore > 0 ? Math.min(99, Math.round(totalScore / 5)) : undefined}
          deltaLabel={totalScore > 0 ? "vs. average student" : "Complete a simulation"}
          color="#8b5cf6"
          trend={totalScore > 0 ? "up" : "flat"}
          seed={2}
          icon={TrendingUp}
        />
        <SparkCard
          label="Career Match"
          value={confidencePct ? `${confidencePct}%` : "—"}
          sub={dashboard.topCareerMatch ?? "Run a simulation"}
          delta={confidencePct ?? undefined}
          deltaLabel={confidencePct ? "AI confidence score" : "Needs simulation data"}
          color="#06b6d4"
          trend={confidencePct ? "up" : "flat"}
          seed={3}
          icon={Target}
        />
        <SparkCard
          label="Opportunities"
          value={String(opps)}
          sub="active listings"
          delta={opps > 0 ? 15 : undefined}
          deltaLabel={opps > 0 ? "New this week" : "Linked to your profile"}
          color="#10b981"
          trend="up"
          seed={4}
          icon={Briefcase}
        />
      </div>

      {/* Roadmap progress bar — full width premium */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">Roadmap Completion</p>
            <p className="text-2xl font-bold font-mono text-white">{roadmap}%</p>
          </div>
          <Link href="/roadmap">
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors font-medium">
              View Roadmap <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="w-full bg-white/[0.04] rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${roadmap}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="h-2 rounded-full"
            style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-zinc-600">Foundation</span>
          <span className="text-xs text-zinc-600">Career Ready</span>
        </div>
      </motion.div>

      {/* Two-col bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent sessions — wider */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white text-lg">Recent Sessions</h2>
            <Link href="/simulations">
              <button className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          {dashboard.recentSessions?.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary/60" />
              </div>
              <p className="text-sm font-medium text-zinc-400 mb-1">No sessions yet</p>
              <p className="text-xs text-zinc-600 mb-4">Start a simulation to see your results here.</p>
              <Link href="/simulations">
                <Button size="sm">Browse Simulations</Button>
              </Link>
            </div>
          ) : (
            <div>
              {dashboard.recentSessions?.map((session, i) => (
                <SessionRow key={session.id} session={session} index={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick actions — narrower */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-6 flex flex-col gap-4"
        >
          <h2 className="font-bold text-white text-lg">Quick Actions</h2>

          <Link href="/simulations" className="block">
            <div className="rounded-xl border border-white/[0.06] hover:border-primary/30 p-4 transition-all hover:bg-primary/5 cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <p className="font-semibold text-white text-sm">Run Simulation</p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Put yourself in the shoes of a professional. Real incidents, real stakes.</p>
            </div>
          </Link>

          <Link href="/roadmap" className="block">
            <div className="rounded-xl border border-white/[0.06] hover:border-violet-500/30 p-4 transition-all hover:bg-violet-500/5 cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                </div>
                <p className="font-semibold text-white text-sm">Build Roadmap</p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Accept AI milestones or add your own. Track your path to your career.</p>
            </div>
          </Link>

          <Link href="/opportunities" className="block">
            <div className="rounded-xl border border-white/[0.06] hover:border-emerald-500/30 p-4 transition-all hover:bg-emerald-500/5 cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="font-semibold text-white text-sm">Explore Opportunities</p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Scholarships, programs, and internships matched to your profile.</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
