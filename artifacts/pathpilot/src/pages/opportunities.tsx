import { useListOpportunities, useGetProfile } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Calendar, MapPin, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

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

const DIFFICULTY_COLORS: Record<string, { text: string; bg: string }> = {
  high: { text: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  medium: { text: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  low: { text: "#10b981", bg: "rgba(16,185,129,0.1)" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Opportunities() {
  const [category, setCategory] = useState<string | null>(null);
  const { data: opportunities, isLoading } = useListOpportunities(category ? { category } : undefined);
  const { data: profile } = useGetProfile();

  const location = profile?.country;
  const interests = profile?.careerInterests ?? [];

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <motion.div variants={fadeUp} className="space-y-2 pt-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Personalized for you
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground">
          Curated programs, internships, and competitions matched to your career analysis
          {location ? ` and your location in ${location}` : ""}.
        </p>
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {interests.slice(0, 5).map((interest) => (
              <span key={interest} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary/80 font-medium capitalize">
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
                ? "bg-primary text-white border-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-transparent"
            }`}
          >
            {cat.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {opportunities?.map((opp, i) => {
            const diff = DIFFICULTY_COLORS[opp.difficulty] ?? DIFFICULTY_COLORS.medium;
            return (
              <motion.div
                key={opp.id}
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-border/60 bg-card flex flex-col overflow-hidden group"
              >
                {/* Top color bar */}
                <div className="h-1 bg-primary/60 w-0 group-hover:w-full transition-all duration-500" />

                <div className="p-6 flex-1 space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {CATEGORY_LABELS[opp.category] ?? opp.category}
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{ color: diff.text, background: diff.bg }}>
                          {opp.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground leading-snug mb-0.5">{opp.title}</h3>
                    <p className="text-sm text-muted-foreground">{opp.organization}</p>
                  </div>

                  {/* Match score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Relevance match</span>
                      <span className="font-mono font-bold text-primary">{opp.relevanceScore}%</span>
                    </div>
                    <Progress value={opp.relevanceScore} className="h-1.5" />
                    <p className="text-xs text-muted-foreground italic">{opp.whyItMatches}</p>
                  </div>

                  <p className="text-sm text-foreground/70 line-clamp-2">{opp.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(opp.applicationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    {opp.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {opp.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-border/40">
                  {opp.url ? (
                    <a href={opp.url} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-accent hover:border-primary/30 transition-all">
                      Apply now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-muted text-sm font-semibold text-muted-foreground text-center">
                      Applications closed
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {opportunities?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
              <p className="text-lg font-medium">No opportunities in this category yet.</p>
              <p className="text-sm">Try a different filter or check back soon.</p>
            </div>
          )}
        </div>
      )}

      {/* Roadmap CTA */}
      <motion.div
        variants={fadeUp}
        custom={12}
        className="rounded-2xl border border-border/60 bg-card p-7 flex flex-col sm:flex-row items-center justify-between gap-5"
      >
        <div>
          <h3 className="text-lg font-bold">Ready for your roadmap?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get a personalized, step-by-step action plan built around your career match, location, and age.
          </p>
        </div>
        <Link href="/roadmap">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm whitespace-nowrap shrink-0"
            style={{ boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}
          >
            View my roadmap <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
