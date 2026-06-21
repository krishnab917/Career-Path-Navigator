import { useGetRoadmap, useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Book, Zap, Code, Award, Trophy, Briefcase, Sparkles, MapPin, GraduationCap } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  course: <Book className="w-4 h-4 text-blue-400" />,
  skill: <Zap className="w-4 h-4 text-yellow-400" />,
  project: <Code className="w-4 h-4 text-violet-400" />,
  certification: <Award className="w-4 h-4 text-purple-400" />,
  competition: <Trophy className="w-4 h-4 text-orange-400" />,
  experience: <Briefcase className="w-4 h-4 text-emerald-400" />,
};

const PRIORITY_STYLES: Record<string, { text: string; bg: string; label: string }> = {
  essential: { text: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Essential" },
  recommended: { text: "#6366f1", bg: "rgba(99,102,241,0.1)", label: "Recommended" },
  optional: { text: "#6b7280", bg: "rgba(107,114,128,0.1)", label: "Optional" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Roadmap() {
  const { data: roadmap, isLoading: roadmapLoading } = useGetRoadmap();
  const { data: profile, isLoading: profileLoading } = useGetProfile();

  const isLoading = roadmapLoading || profileLoading;

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!roadmap) return (
    <div className="text-center py-24">
      <p className="text-muted-foreground text-lg">Complete a simulation to unlock your personalized roadmap.</p>
    </div>
  );

  const firstName = profile?.name?.split(" ")[0] ?? "You";
  const country = profile?.country;
  const curriculum = profile?.curriculum;
  const age = profile?.age;

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <motion.div variants={fadeUp} className="space-y-4 pt-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" /> AI-generated roadmap
        </div>
        <div>
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-1">Your path to</p>
          <h1 className="text-5xl font-bold tracking-tight">{roadmap.targetCareer}</h1>
        </div>

        {/* Personalization context */}
        <div className="flex flex-wrap gap-4 pt-1">
          {[
            profile?.name ? { icon: <GraduationCap className="w-3.5 h-3.5" />, text: `Built for ${firstName}` } : null,
            age ? { icon: <Sparkles className="w-3.5 h-3.5" />, text: `Age ${age}` } : null,
            country ? { icon: <MapPin className="w-3.5 h-3.5" />, text: country } : null,
            curriculum ? { icon: <Book className="w-3.5 h-3.5" />, text: curriculum } : null,
          ].filter(Boolean).map((item, i) => item && (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              {item.icon} {item.text}
            </div>
          ))}
        </div>

        <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl">
          This roadmap is tailored to {firstName}'s profile — sequenced to fit your current education stage
          {curriculum ? ` as a ${curriculum} student` : ""}{country ? ` in ${country}` : ""}, with milestones that build toward a career in {roadmap.targetCareer}.
        </p>
      </motion.div>

      {/* Phase overview */}
      <motion.div variants={fadeUp} custom={1} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {roadmap.phases.map((phase, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card px-5 py-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Phase {String(i + 1).padStart(2, "0")}</div>
            <div className="font-bold text-foreground text-[15px]">{phase.name}</div>
            <div className="text-xs text-primary mt-1">{phase.timeframe}</div>
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{phase.focus}</div>
          </div>
        ))}
      </motion.div>

      {/* Phases + milestones */}
      <div className="space-y-14">
        {roadmap.phases.map((phase, phaseIdx) => {
          const phaseMilestones = roadmap.milestones.filter((m) => m.timeframe === phase.timeframe);
          return (
            <motion.div key={phaseIdx} variants={fadeUp} custom={phaseIdx + 2}>
              {/* Phase header */}
              <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold font-mono text-muted-foreground/20">
                    {String(phaseIdx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{phase.name}</h2>
                    <p className="text-sm text-primary font-medium">{phase.timeframe} — {phase.focus}</p>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="relative pl-8 border-l border-border/30 space-y-5">
                {phaseMilestones.map((milestone, mIdx) => {
                  const priority = PRIORITY_STYLES[milestone.priority] ?? PRIORITY_STYLES.optional;
                  return (
                    <motion.div
                      key={milestone.id}
                      variants={fadeUp}
                      custom={phaseIdx * 5 + mIdx + 3}
                      whileHover={{ x: 2 }}
                      className="relative ml-6 rounded-2xl border border-border/60 bg-card p-5 group transition-all hover:border-primary/30"
                    >
                      {/* Connector dot */}
                      <div className="absolute -left-[3.25rem] top-5 w-8 h-px bg-border/40" />
                      <div className="absolute -left-[3.75rem] top-3.5 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center">
                        {iconMap[milestone.type] ?? <Zap className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>

                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ color: priority.text, background: priority.bg }}>
                            {priority.label}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono capitalize">{milestone.type}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>

                      {milestone.resources && milestone.resources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/40">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Resources</span>
                          <ul className="space-y-1.5">
                            {milestone.resources.map((res, j) => (
                              <li key={j} className="text-sm text-primary flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary shrink-0" /> {res}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {phaseMilestones.length === 0 && (
                  <div className="ml-6 py-8 text-center text-sm text-muted-foreground">
                    Milestones for this phase are being generated based on your profile.
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <motion.div
        variants={fadeUp}
        custom={15}
        className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
      >
        <Sparkles className="w-5 h-5 text-primary mx-auto mb-3" />
        <h3 className="font-bold text-foreground mb-1">This roadmap evolves with you</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          As you complete more simulations and update your profile, your roadmap will adapt — surfacing milestones that match where you are in your journey.
        </p>
      </motion.div>
    </motion.div>
  );
}
