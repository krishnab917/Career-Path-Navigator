import {
  useGetRoadmap,
  useGetProfile,
  useListRoadmapItems,
  useCreateRoadmapItem,
  useUpdateRoadmapItem,
  useDeleteRoadmapItem,
  getListRoadmapItemsQueryKey,
  getGetRoadmapQueryKey,
} from "@workspace/api-client-react";
import type { UserRoadmapItem, RoadmapMilestone } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Zap,
  Code,
  Award,
  Trophy,
  Briefcase,
  Sparkles,
  MapPin,
  GraduationCap,
  CheckCircle2,
  Circle,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StateLabel } from "@/components/state-label";
import {
  SystemCard,
  SystemCardHeader,
  SystemCardTitle,
  SystemCardDescription,
  SystemCardContent,
} from "@/components/system-card";

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
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function AddMilestoneModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: { title: string; type: string; phase: string; description: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("skill");
  const [phase, setPhase] = useState("Now");
  const [description, setDescription] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">Add Custom Milestone</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete CS50 on edX"
              className="w-full bg-muted/30 border border-border/60 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-muted/30 border border-border/60 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
              >
                <option value="skill">Skill</option>
                <option value="course">Course</option>
                <option value="project">Project</option>
                <option value="certification">Certification</option>
                <option value="experience">Experience</option>
                <option value="competition">Competition</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Phase</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full bg-muted/30 border border-border/60 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
              >
                <option value="Now">Now</option>
                <option value="Next">Next</option>
                <option value="Later">Later</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you do or learn?"
              rows={3}
              className="w-full bg-muted/30 border border-border/60 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!title.trim()}
              onClick={() => {
                if (title.trim()) onSave({ title, type, phase, description });
              }}
            >
              Add to Roadmap
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuggestionCard({
  milestone,
  isAccepted,
  isSkipped,
  onAccept,
  onSkip,
  isLoading,
}: {
  milestone: RoadmapMilestone;
  isAccepted: boolean;
  isSkipped: boolean;
  onAccept: () => void;
  onSkip: () => void;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_STYLES[milestone.priority] ?? PRIORITY_STYLES.optional;

  if (isSkipped) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`relative rounded-2xl border transition-all duration-300 ${
        isAccepted
          ? "border-primary/40 bg-primary/5"
          : "border-border/60 bg-card hover:border-primary/30"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ color: priority.text, background: priority.bg }}
            >
              {priority.label}
            </span>
            <span className="text-xs text-muted-foreground font-mono capitalize">{milestone.type}</span>
          </div>

          {isAccepted ? (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Added</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={onSkip}
                disabled={isLoading}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
              >
                Skip
              </button>
              <button
                onClick={onAccept}
                disabled={isLoading}
                className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20"
              >
                + Add
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
            {iconMap[milestone.type] ?? <Zap className="w-3 h-3 text-muted-foreground" />}
          </div>
          <h3 className={`font-bold text-[15px] ${isAccepted ? "text-primary" : "text-foreground"}`}>
            {milestone.title}
          </h3>
        </div>

        <AnimatePresence>
          {(expanded || isAccepted) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">{milestone.description}</p>
              {milestone.resources && milestone.resources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Resources</span>
                  <ul className="space-y-1">
                    {milestone.resources.map((res, j) => (
                      <li key={j} className="text-xs text-primary/80 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                        {res}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MyMilestoneCard({
  item,
  onToggleComplete,
  onDelete,
}: {
  item: UserRoadmapItem;
  onToggleComplete: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`relative rounded-xl border p-4 transition-all duration-200 group ${
        item.isCompleted
          ? "border-border/30 bg-muted/10 opacity-60"
          : "border-border/60 bg-card hover:border-primary/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <button onClick={onToggleComplete} className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
          {item.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-primary" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground capitalize">{item.type}</span>
            {item.isUserCreated && (
              <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                <Pencil className="w-2.5 h-2.5" /> Custom
              </span>
            )}
          </div>
          <h4 className={`font-semibold text-sm ${item.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {item.title}
          </h4>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
          )}
        </div>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Roadmap() {
  const qc = useQueryClient();
  const { data: roadmap, isLoading: roadmapLoading } = useGetRoadmap();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: myItems = [], isLoading: itemsLoading } = useListRoadmapItems();

  const createItem = useCreateRoadmapItem();
  const updateItem = useUpdateRoadmapItem();
  const deleteItem = useDeleteRoadmapItem();

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"suggestions" | "mine">("suggestions");

  const isLoading = roadmapLoading || profileLoading || itemsLoading;

  const acceptedIds = new Set(myItems.filter((i) => i.aiMilestoneId !== null).map((i) => i.aiMilestoneId));

  function invalidateItems() {
    qc.invalidateQueries({ queryKey: getListRoadmapItemsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetRoadmapQueryKey() });
  }

  const handleAccept = (milestone: RoadmapMilestone) => {
    createItem.mutate(
      {
        data: {
          title: milestone.title,
          type: milestone.type,
          phase: milestone.timeframe,
          description: milestone.description,
          isUserCreated: false,
          aiMilestoneId: milestone.id,
          resources: milestone.resources ?? [],
        },
      },
      { onSuccess: invalidateItems },
    );
  };

  const handleSkip = (milestone: RoadmapMilestone) => {
    createItem.mutate(
      {
        data: {
          title: milestone.title,
          type: milestone.type,
          phase: milestone.timeframe,
          description: milestone.description,
          isUserCreated: false,
          aiMilestoneId: milestone.id,
          resources: [],
        },
      },
      {
        onSuccess: (newItem) => {
          updateItem.mutate(
            { itemId: newItem.id, data: { status: "skipped" } },
            { onSuccess: invalidateItems },
          );
        },
      },
    );
  };

  const handleCustomAdd = (data: { title: string; type: string; phase: string; description: string }) => {
    createItem.mutate(
      { data: { ...data, isUserCreated: true, resources: [] } },
      {
        onSuccess: () => {
          invalidateItems();
          setShowAddModal(false);
          setActiveTab("mine");
        },
      },
    );
  };

  const handleToggleComplete = (item: UserRoadmapItem) => {
    updateItem.mutate(
      { itemId: item.id, data: { isCompleted: !item.isCompleted } },
      { onSuccess: invalidateItems },
    );
  };

  const handleDelete = (item: UserRoadmapItem) => {
    deleteItem.mutate(
      { itemId: item.id },
      { onSuccess: invalidateItems },
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );

  if (!roadmap)
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground text-lg">Complete a simulation to unlock your personalized roadmap.</p>
      </div>
    );

  const firstName = profile?.name?.split(" ")[0] ?? "You";
  const country = profile?.country;
  const curriculum = profile?.curriculum;
  const age = profile?.age;

  const completedCount = myItems.filter((i) => i.isCompleted).length;
  const totalMy = myItems.filter((i) => i.status !== "skipped").length;
  const progress = totalMy > 0 ? Math.round((completedCount / totalMy) * 100) : 0;

  const suggestionsByPhase = roadmap.phases.map((phase) => ({
    phase,
    milestones: roadmap.milestones.filter((m) => m.phase === phase.name),
  }));

  const myActiveItems = myItems.filter((i) => i.status !== "skipped");

  return (
    <>
      <AnimatePresence>
        {showAddModal && (
          <AddMilestoneModal onClose={() => setShowAddModal(false)} onSave={handleCustomAdd} />
        )}
      </AnimatePresence>

      <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <motion.div variants={fadeUp} className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <StateLabel variant={progress >= 80 ? "stable" : progress > 0 ? "evolving" : "active"} label={progress >= 80 ? "On Track" : progress > 0 ? "In Progress" : "Getting Started"} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Interactive Roadmap Builder</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Your path to</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">{roadmap.targetCareer}</h1>
          </div>

          {/* Personalization context */}
          <div className="flex flex-wrap gap-3 pt-1">
            {[
              profile?.name ? { icon: <GraduationCap className="w-3.5 h-3.5" />, text: `Built for ${firstName}` } : null,
              age ? { icon: <Sparkles className="w-3.5 h-3.5" />, text: `Age ${age}` } : null,
              country ? { icon: <MapPin className="w-3.5 h-3.5" />, text: country } : null,
              curriculum ? { icon: <Book className="w-3.5 h-3.5" />, text: curriculum } : null,
            ]
              .filter(Boolean)
              .map(
                (item, i) =>
                  item && (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full"
                    >
                      {item.icon} {item.text}
                    </div>
                  ),
              )}
          </div>
        </motion.div>

        {/* Progress bar */}
        {totalMy > 0 && (
          <motion.div variants={fadeUp} custom={0.5}>
            <SystemCard>
              <SystemCardHeader badge={<StateLabel variant={progress >= 80 ? "stable" : "evolving"} />}>
                <SystemCardTitle>Your Progress</SystemCardTitle>
                <SystemCardDescription>{completedCount} of {totalMy} milestones completed</SystemCardDescription>
              </SystemCardHeader>
              <SystemCardContent className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold font-mono text-white">{progress}%</span>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-2 rounded-full"
                    style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
                  />
                </div>
              </SystemCardContent>
            </SystemCard>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div variants={fadeUp} custom={1} className="flex items-center gap-1 bg-muted/30 rounded-xl p-1 border border-border/40">
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex-1 text-sm font-medium py-2 px-4 rounded-lg transition-all ${
              activeTab === "suggestions" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AI Suggestions
            <span className="ml-2 text-xs font-mono text-muted-foreground">
              {roadmap.milestones.filter((m) => !acceptedIds.has(m.id) && !myItems.find(i => i.aiMilestoneId === m.id && i.status === "skipped")).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("mine")}
            className={`flex-1 text-sm font-medium py-2 px-4 rounded-lg transition-all ${
              activeTab === "mine" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Roadmap
            <span className="ml-2 text-xs font-mono text-muted-foreground">{myActiveItems.length}</span>
          </button>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "suggestions" ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Accept AI-suggested milestones to add them to your roadmap, or skip ones that don't apply.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddModal(true)}
                  className="gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Custom
                </Button>
              </div>

              {suggestionsByPhase.map(({ phase, milestones: phaseMilestones }, phaseIdx) => (
                <motion.div key={phase.name} variants={fadeUp} custom={phaseIdx + 2}>
                  {/* Phase header */}
                  <div className="mb-5 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold font-mono text-muted-foreground/20">
                        {String(phaseIdx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{phase.name}</h2>
                        <p className="text-sm text-primary font-medium">{phase.timeframe} — {phase.focus}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {phaseMilestones.map((milestone) => {
                        const accepted = acceptedIds.has(milestone.id);
                        const skipped = myItems.some(i => i.aiMilestoneId === milestone.id && i.status === "skipped");
                        return (
                          <SuggestionCard
                            key={milestone.id}
                            milestone={milestone}
                            isAccepted={accepted}
                            isSkipped={skipped}
                            onAccept={() => handleAccept(milestone)}
                            onSkip={() => handleSkip(milestone)}
                            isLoading={createItem.isPending}
                          />
                        );
                      })}
                    </AnimatePresence>
                    {phaseMilestones.length === 0 && (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Milestones for this phase are being generated.
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="mine"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Your accepted and custom milestones. Check off items as you complete them.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddModal(true)}
                  className="gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Custom
                </Button>
              </div>

              {myActiveItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-dashed border-border/60 py-16 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-primary/60" />
                  </div>
                  <p className="font-medium text-foreground mb-1">Your roadmap is empty</p>
                  <p className="text-sm text-muted-foreground mb-5">
                    Go to AI Suggestions and accept milestones to build your personalized roadmap.
                  </p>
                  <Button size="sm" onClick={() => setActiveTab("suggestions")}>
                    Browse Suggestions
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {myActiveItems.map((item) => (
                      <MyMilestoneCard
                        key={item.id}
                        item={item}
                        onToggleComplete={() => handleToggleComplete(item)}
                        onDelete={() => handleDelete(item)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
