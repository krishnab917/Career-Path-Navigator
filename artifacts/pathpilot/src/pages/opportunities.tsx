import { useListOpportunities, useGetProfile } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Calendar, MapPin, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  SystemCard,
  SystemCardHeader,
  SystemCardTitle,
  SystemCardDescription,
  SystemCardContent,
  SystemCardMeta,
  SystemCardActions,
} from "@/components/system-card";
import { StateLabel } from "@/components/state-label";

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Internship", value: "internship" },
  { label: "Research", value: "research" },
  { label: "Scholarship", value: "scholarship" },
  { label: "Competition", value: "competition" },
  { label: "Hackathon", value: "hackathon" },
  { label: "Mentorship", value: "mentorship" },
  { label: "Summer Program", value: "summer_program" },
];

const CATEGORY_LABELS: Record<string, string> = {
  internship: "Internship",
  research: "Research",
  scholarship: "Scholarship",
  competition: "Competition",
  hackathon: "Hackathon",
  mentorship: "Mentorship",
  summer_program: "Summer Program",
};

// Map difficulty to state label
function difficultyToState(d: string): "stable" | "evolving" | "high-risk" {
  if (d === "low") return "stable";
  if (d === "medium") return "evolving";
  return "high-risk";
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function Opportunities() {
  const [category, setCategory] = useState<string | null>(null);
  const { data: opportunities, isLoading } = useListOpportunities(
    category ? { category } : undefined
  );
  const { data: profile } = useGetProfile();

  const location = profile?.country;
  const interests = profile?.careerInterests ?? [];

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-8 pb-12">
      {/* Header */}
      <motion.div variants={fadeUp} className="space-y-2 pt-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Personalized for you
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities</h1>
        <p className="text-muted-foreground text-sm">
          Curated programs, internships, and competitions matched to your career analysis
          {location ? ` and your location in ${location}` : ""}.
        </p>
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {interests.slice(0, 5).map((interest) => (
              <span
                key={interest}
                className="text-xs px-2.5 py-1 rounded-full bg-primary/6 text-primary/80 font-medium capitalize"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={fadeUp} custom={1} className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.label}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setCategory(cat.value)}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all border ${
              category === cat.value
                ? "bg-primary text-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-transparent"
            }`}
          >
            {cat.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 rounded-xl bg-primary/4 border border-border/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {opportunities?.map((opp, i) => (
            <motion.div key={opp.id} variants={fadeUp} custom={i + 2} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <SystemCard className="h-full hover:border-primary/30 transition-colors group">
                {/* Top accent bar */}
                <div className="h-1 w-0 group-hover:w-full bg-primary/60 transition-all duration-500 flex-shrink-0" />

                <SystemCardHeader
                  badge={<StateLabel variant={difficultyToState(opp.difficulty)} />}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/4 text-muted-foreground">
                      {CATEGORY_LABELS[opp.category] ?? opp.category}
                    </span>
                  </div>
                  <SystemCardTitle className="text-base">{opp.title}</SystemCardTitle>
                  <SystemCardDescription>{opp.organization}</SystemCardDescription>
                </SystemCardHeader>

                <SystemCardContent className="space-y-4">
                  {/* Match score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Relevance match</span>
                      <span className="font-mono font-bold text-primary">{opp.relevanceScore}%</span>
                    </div>
                    <Progress value={opp.relevanceScore} className="h-1.5" />
                    <p className="text-[11px] text-muted-foreground italic">{opp.whyItMatches}</p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{opp.description}</p>
                </SystemCardContent>

                <SystemCardMeta>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(opp.applicationDeadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {opp.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {opp.location}
                    </span>
                  )}
                </SystemCardMeta>

                <SystemCardActions>
                  {opp.url ? (
                    <a href={opp.url} target="_blank" rel="noreferrer" className="flex-1">
                      <button className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-white/[0.08] text-sm font-semibold text-foreground hover:bg-primary/3 hover:border-primary/30 transition-all">
                        Apply now <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </a>
                  ) : (
                    <div className="flex-1 py-2 rounded-xl bg-primary/4 text-sm font-semibold text-muted-foreground text-center">
                      Applications closed
                    </div>
                  )}
                </SystemCardActions>
              </SystemCard>
            </motion.div>
          ))}

          {opportunities?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
              <p className="text-base font-medium">No opportunities in this category yet.</p>
              <p className="text-sm">Try a different filter or check back soon.</p>
            </div>
          )}
        </div>
      )}

      {/* Roadmap CTA */}
      <motion.div variants={fadeUp} custom={12}>
        <SystemCard variant="elevated">
          <SystemCardHeader badge={<StateLabel variant="active" label="Recommended" />}>
            <SystemCardTitle className="text-base">Ready for your roadmap?</SystemCardTitle>
            <SystemCardDescription>
              Get a personalized, step-by-step action plan built around your career match, location, and age.
            </SystemCardDescription>
          </SystemCardHeader>
          <SystemCardActions>
            <Link href="/roadmap">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-foreground font-semibold text-sm"
              >
                View my roadmap <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </SystemCardActions>
        </SystemCard>
      </motion.div>
    </motion.div>
  );
}
