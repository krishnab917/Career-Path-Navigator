import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Zap,
  Briefcase,
  Map,
  ChevronRight,
  Activity,
  TrendingUp,
  Target,
} from "lucide-react";

// ─── Navigation items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Simulations", href: "/simulations", icon: Zap },
  { label: "Opportunities", href: "/opportunities", icon: Briefcase },
  { label: "Roadmap", href: "/roadmap", icon: Map },
];

// ─── Sidebar nav item ─────────────────────────────────────────────────────────
function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group
          ${active
            ? "bg-primary/10 text-primary border border-primary/20"
            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
          }`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? "text-primary" : "group-hover:text-zinc-300"}`} />
        <span>{label}</span>
        {active && <ChevronRight className="w-3 h-3 ml-auto text-primary/60" />}
      </div>
    </Link>
  );
}

// ─── Right context panel ──────────────────────────────────────────────────────
function ContextPanel() {
  const stats = [
    { label: "Simulations Run", value: "—", icon: Activity, color: "#6366f1" },
    { label: "Career Match", value: "—", icon: Target, color: "#06b6d4" },
    { label: "Roadmap Progress", value: "0%", icon: TrendingUp, color: "#10b981" },
  ];

  return (
    <aside className="w-56 flex-shrink-0 border-l border-white/[0.05] bg-[#070b14] hidden xl:flex flex-col gap-6 p-5 overflow-y-auto">
      {/* System status */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">System Status</p>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="text-xs font-medium text-emerald-400">All systems live</span>
        </div>
      </div>

      {/* Quick stats */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Quick Stats</p>
        <div className="space-y-2">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                <span className="text-xs text-zinc-500">{label}</span>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-300">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended next step */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Recommended</p>
        <Link href="/simulations">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 cursor-pointer hover:bg-primary/10 transition-colors group">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="text-xs font-bold text-primary">Run a Simulation</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Start your first scenario to unlock career insights and trait analysis.
            </p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-primary/60 group-hover:text-primary transition-colors">
              Start now <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}

// ─── Main layout shell ────────────────────────────────────────────────────────
export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#060a12]">
      {/* ── Top bar (brand + user) ── */}
      <header className="h-14 flex-shrink-0 border-b border-white/[0.05] bg-[#060a12]/95 backdrop-blur sticky top-0 z-50 flex items-center px-5 gap-4">
        <Link href="/" className="flex items-center gap-2.5 mr-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-white">PathPilot</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active session
          </div>
          <Avatar className="h-7 w-7 border border-white/[0.1]">
            <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">US</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* ── 3-zone body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ZONE 1 — Left sidebar navigation */}
        <motion.aside
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-52 flex-shrink-0 border-r border-white/[0.05] bg-[#070b14] hidden md:flex flex-col gap-1 p-4 overflow-y-auto"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-3 mb-2">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={
                item.href === "/simulations"
                  ? location.startsWith("/simulations") || location.startsWith("/analysis")
                  : location === item.href
              }
            />
          ))}

          {/* Bottom section */}
          <div className="mt-auto pt-4 border-t border-white/[0.04]">
            <Link href="/onboarding">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03] transition-all cursor-pointer border border-transparent">
                <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-primary">P</span>
                </div>
                Profile Setup
              </div>
            </Link>
          </div>
        </motion.aside>

        {/* ZONE 2 — Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>

        {/* ZONE 3 — Right context panel */}
        <ContextPanel />
      </div>
    </div>
  );
}
