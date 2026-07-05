import { useGetDashboard } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  TrendingUp,
  Briefcase,
  RotateCcw,
  ChevronRight,
  Clock,
  Award,
  Play,
} from "lucide-react";
import { useMemo } from "react";
import {
  SystemCard,
  SystemCardHeader,
  SystemCardTitle,
  SystemCardDescription,
  SystemCardContent,
  SystemCardActions,
} from "@/components/system-card";
import { StateLabel } from "@/components/state-label";

// ─── Sparkline data ───────────────────────────────────────────────────────────
function generateSparklineData(seed: number, points = 12, trend: "up" | "down" | "flat" = "up") {
  const data = [];
  let value = 30 + (seed % 20);
  for (let i = 0; i < points; i++) {
    const noise = Math.sin(seed * i * 0.7) * 8 + (Math.random() * 6 - 3);
    if (trend === "up") value += 1.5 + noise * 0.5;
    else if (trend === "down") value -= 0.8 + noise * 0.3;
    else value += noise * 0.4;
    data.push({ v: Math.max(0, Math.min(100, value)) });
  }
  return data;
}

// ─── SparkCard ────────────────────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: seed * 0.06 }}
      className="relative overflow-hidden rounded-xl border border-border/40 bg-card flex flex-col"
    >
      <div className="p-4 pb-2 flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <Icon className="w-3.5 h-3.5" style={{ color }} />
            {label}
          </div>
          {delta !== undefined && (
            <div
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {Math.abs(delta)}%
            </div>
          )}
        </div>
        <div className="text-3xl font-bold tracking-tight text-foreground font-mono mb-0.5">{value}</div>
        {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
        {deltaLabel && <div className="text-[11px] text-muted-foreground mt-1">{deltaLabel}</div>}
      </div>
      <div className="h-12 w-full">
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
            <Tooltip content={() => null} cursor={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ─── Session row ──────────────────────────────────────────────────────────────
function SessionRow({
  session,
  index,
}: {
  session: {
    id: number;
    simulationTitle?: string | null;
    status: string;
    score: number;
    completedAt?: string | null;
  };
  index: number;
}) {
  const isCompleted = session.status === "completed";
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isCompleted ? "bg-emerald-500/10" : "bg-primary/6"
          }`}
        >
          {isCompleted ? (
            <Award className="w-4 h-4 text-emerald-400" />
          ) : (
            <Clock className="w-4 h-4 text-primary" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {session.simulationTitle || "Simulation"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {isCompleted ? `Completed · Score ${session.score}` : "In progress"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {isCompleted && (
          <StateLabel variant="completed" className="hidden sm:inline-flex" />
        )}
        {!isCompleted && (
          <StateLabel variant="active" label="In Progress" className="hidden sm:inline-flex" />
        )}
        {isCompleted ? (
          <Link href={`/analysis/${session.id}`}>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group-hover:text-primary">
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

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { data: dashboard, isLoading, refetch } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const totalScore = dashboard.totalScore ?? 0;
  const sims = dashboard.simulationsCompleted ?? 0;
  const opps = dashboard.activeOpportunities ?? 0;
  const roadmap = dashboard.roadmapProgress ?? 0;
  const confidencePct = dashboard.topCareerConfidence
    ? Math.round(dashboard.topCareerConfidence)
    : null;

  // Determine overall system state
  const systemState =
    sims === 0 ? "evolving" : confidencePct && confidencePct >= 80 ? "stable" : "evolving";

  return (
    <div className="space-y-6 pb-16">

      {/* ── ZONE 1: Hero / Continue section ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StateLabel variant={systemState} label={systemState === "stable" ? "Career Stable" : "Building Profile"} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">PathPilot Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your career intelligence at a glance</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border/40 rounded-lg px-3 py-2 hover:border-white/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </motion.div>

      {/* ── ZONE 2: Primary action — Continue / Start simulation ─────────── */}
      {!dashboard.profileComplete ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SystemCard variant="elevated">
            <SystemCardHeader badge={<StateLabel variant="evolving" label="Action Required" />}>
              <SystemCardTitle className="text-base">Complete your profile to unlock insights</SystemCardTitle>
              <SystemCardDescription>
                Takes under 2 minutes. Tailors every simulation to your background.
              </SystemCardDescription>
            </SystemCardHeader>
            <SystemCardActions>
              <Link href="/onboarding">
                <Button size="sm">
                  <Play className="w-3.5 h-3.5 mr-2" />
                  Get Started
                </Button>
              </Link>
            </SystemCardActions>
          </SystemCard>
        </motion.div>
      ) : sims === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SystemCard variant="elevated">
            <SystemCardHeader badge={<StateLabel variant="active" label="Recommended Next Step" />}>
              <SystemCardTitle className="text-base">Run your first simulation</SystemCardTitle>
              <SystemCardDescription>
                Experience a real-world career scenario and unlock your behavioral profile.
              </SystemCardDescription>
            </SystemCardHeader>
            <SystemCardActions>
              <Link href="/simulations">
                <Button size="sm">
                  <Zap className="w-3.5 h-3.5 mr-2" />
                  Browse Simulations
                </Button>
              </Link>
            </SystemCardActions>
          </SystemCard>
        </motion.div>
      ) : null}

      {/* ── ZONE 3: Metric sparkline grid ────────────────────────────────── */}
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
          label="Score"
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

      {/* ── ZONE 4: Roadmap progress ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SystemCard>
          <SystemCardHeader badge={<StateLabel variant={roadmap >= 80 ? "stable" : roadmap > 0 ? "evolving" : "locked"} />}>
            <SystemCardTitle>Roadmap Completion</SystemCardTitle>
            <SystemCardDescription>Your progress toward career readiness</SystemCardDescription>
          </SystemCardHeader>
          <SystemCardContent className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold font-mono text-foreground">{roadmap}%</span>
              <Link href="/roadmap">
                <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors font-medium">
                  View Roadmap <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="w-full bg-primary/3 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${roadmap}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-2 rounded-full"
                style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-muted-foreground">Foundation</span>
              <span className="text-[11px] text-muted-foreground">Career Ready</span>
            </div>
          </SystemCardContent>
        </SystemCard>
      </motion.div>

      {/* ── ZONE 5: Recent sessions + Quick actions ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent sessions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-3"
        >
          <SystemCard className="h-full">
            <SystemCardHeader>
              <SystemCardTitle>Recent Sessions</SystemCardTitle>
              <SystemCardDescription>Your latest simulation activity</SystemCardDescription>
            </SystemCardHeader>
            <SystemCardContent>
              {dashboard.recentSessions?.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/6 flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-primary/60" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">No sessions yet</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Start a simulation to see your results here.
                  </p>
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
            </SystemCardContent>
            <SystemCardActions className="justify-start">
              <Link href="/simulations">
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  All simulations <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </SystemCardActions>
          </SystemCard>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <SystemCard className="h-full">
            <SystemCardHeader>
              <SystemCardTitle>Quick Actions</SystemCardTitle>
              <SystemCardDescription>Jump to key features</SystemCardDescription>
            </SystemCardHeader>
            <SystemCardContent className="flex flex-col gap-3">
              <Link href="/simulations" className="block">
                <div className="rounded-xl border border-border/40 hover:border-primary/30 p-4 transition-all hover:bg-primary/4 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/6 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground text-sm">Run Simulation</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Real incidents, real stakes.
                  </p>
                </div>
              </Link>

              <Link href="/roadmap" className="block">
                <div className="rounded-xl border border-border/40 hover:border-blue-500/30 p-4 transition-all hover:bg-blue-500/5 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <p className="font-semibold text-foreground text-sm">Build Roadmap</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Accept AI milestones or add your own.
                  </p>
                </div>
              </Link>

              <Link href="/opportunities" className="block">
                <div className="rounded-xl border border-border/40 hover:border-emerald-500/30 p-4 transition-all hover:bg-emerald-500/5 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="font-semibold text-foreground text-sm">Explore Opportunities</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Scholarships, programs, and internships.
                  </p>
                </div>
              </Link>
            </SystemCardContent>
          </SystemCard>
        </motion.div>
      </div>
    </div>
  );
}
