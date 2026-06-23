import { pgTable, text, serial, integer, timestamp, real, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Expanded opportunities table for large-scale opportunity engine
 * Supports hundreds of opportunities across multiple career paths
 */
export const opportunitiesExpandedTable = pgTable("opportunities_expanded", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // internship, research, competition, scholarship, fellowship, etc.
  careerCategories: text("career_categories").array().notNull().default([]), // e.g., ["software_engineer", "data_scientist"]
  skillRelevance: text("skill_relevance").array().notNull().default([]), // e.g., ["Python", "Machine Learning", "Data Analysis"]
  difficulty: text("difficulty").notNull().default("intermediate"), // beginner, intermediate, advanced
  deadline: timestamp("deadline", { withTimezone: true }),
  location: text("location"), // "Remote", "San Francisco, CA", etc.
  timeCommitment: text("time_commitment"), // "10 hours/week", "Full-time", "Part-time", etc.
  applicationLink: text("application_link"),
  relevanceScore: real("relevance_score").notNull().default(0.5), // 0-1 scale
  whyItMatches: text("why_it_matches"), // Explanation of why this matches the user's profile
  stipend: text("stipend"), // "Paid", "Unpaid", "$5000", etc.
  requirements: text("requirements").array().notNull().default([]),
  benefits: text("benefits").array().notNull().default([]),
  testimonials: jsonb("testimonials").notNull().default([]), // Array of { name, text, role }
  applicationCount: integer("application_count").notNull().default(0),
  acceptanceRate: real("acceptance_rate"), // 0-1 scale, e.g., 0.15 for 15%
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertOpportunitiesExpandedSchema = createInsertSchema(opportunitiesExpandedTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOpportunitiesExpanded = z.infer<typeof insertOpportunitiesExpandedSchema>;
export type OpportunitiesExpanded = typeof opportunitiesExpandedTable.$inferSelect;

/**
 * User saved opportunities (bookmarks)
 */
export const userSavedOpportunitiesTable = pgTable("user_saved_opportunities", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  opportunityId: integer("opportunity_id").notNull().references(() => opportunitiesExpandedTable.id),
  savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
  status: text("status").notNull().default("saved"), // saved, applied, accepted, rejected
  notes: text("notes"),
  addedToRoadmap: boolean("added_to_roadmap").notNull().default(false),
});

export const insertUserSavedOpportunitiesSchema = createInsertSchema(userSavedOpportunitiesTable).omit({
  id: true,
  savedAt: true,
});
export type InsertUserSavedOpportunities = z.infer<typeof insertUserSavedOpportunitiesSchema>;
export type UserSavedOpportunities = typeof userSavedOpportunitiesTable.$inferSelect;

/**
 * Opportunity categories
 */
export const OPPORTUNITY_CATEGORIES = [
  "Internship",
  "Research Program",
  "Competition",
  "Scholarship",
  "Fellowship",
  "Summer Program",
  "Volunteer Program",
  "Certification",
  "Hackathon",
  "Project Opportunity",
  "Mentorship",
  "Bootcamp",
  "Workshop",
  "Conference",
];

/**
 * Sample opportunities data for seeding
 * In production, this would be sourced from APIs or a database
 */
export const SAMPLE_OPPORTUNITIES = [
  // Software Engineer opportunities
  {
    title: "Google Summer of Code",
    organization: "Google",
    description:
      "Google Summer of Code is a global program focused on bringing more student developers into open source software development.",
    category: "Summer Program",
    careerCategories: ["software_engineer", "data_scientist"],
    skillRelevance: ["C++", "Python", "Java", "Open Source"],
    difficulty: "intermediate",
    deadline: new Date("2026-04-15"),
    location: "Remote",
    timeCommitment: "Full-time (12 weeks)",
    applicationLink: "https://summerofcode.withgoogle.com",
    relevanceScore: 0.95,
    whyItMatches: "Perfect for building open source experience and learning from industry mentors",
    stipend: "$3000-$6000",
    requirements: ["18+ years old", "Enrolled in university", "Prior open source experience"],
    benefits: ["Mentorship", "Stipend", "Certificate", "Networking"],
    acceptanceRate: 0.2,
    isVerified: true,
  },
  {
    title: "GitHub Internship Program",
    organization: "GitHub",
    description: "Join GitHub as an intern and work on tools used by millions of developers worldwide.",
    category: "Internship",
    careerCategories: ["software_engineer"],
    skillRelevance: ["Ruby", "JavaScript", "Git", "Web Development"],
    difficulty: "intermediate",
    deadline: new Date("2026-03-01"),
    location: "San Francisco, CA / Remote",
    timeCommitment: "Full-time (12 weeks)",
    applicationLink: "https://github.com/careers",
    relevanceScore: 0.92,
    whyItMatches: "Work on core developer tools and learn from GitHub engineers",
    stipend: "$25-$35/hour",
    requirements: ["Currently enrolled in university", "Strong programming skills"],
    benefits: ["Competitive salary", "Housing stipend", "Mentorship", "Full-time offer potential"],
    acceptanceRate: 0.1,
    isVerified: true,
  },
  {
    title: "Jane Street Internship",
    organization: "Jane Street",
    description: "Join a leading quantitative trading firm as an intern and work on challenging problems.",
    category: "Internship",
    careerCategories: ["software_engineer", "data_scientist"],
    skillRelevance: ["OCaml", "Python", "Algorithms", "Trading"],
    difficulty: "advanced",
    deadline: new Date("2026-02-15"),
    location: "New York, NY",
    timeCommitment: "Full-time (10 weeks)",
    applicationLink: "https://www.janestreet.com/careers",
    relevanceScore: 0.85,
    whyItMatches: "Excellent for learning advanced algorithms and trading systems",
    stipend: "$50-$70/hour",
    requirements: ["Strong problem-solving skills", "Comfortable with functional programming"],
    benefits: ["High salary", "Mentorship", "Full-time offer potential"],
    acceptanceRate: 0.05,
    isVerified: true,
  },
  {
    title: "HackMIT",
    organization: "MIT",
    description: "A 24-hour hackathon bringing together students to build amazing projects.",
    category: "Hackathon",
    careerCategories: ["software_engineer", "data_scientist"],
    skillRelevance: ["Any programming language", "Teamwork", "Creativity"],
    difficulty: "beginner",
    deadline: new Date("2026-09-15"),
    location: "Cambridge, MA",
    timeCommitment: "24 hours",
    applicationLink: "https://hackmit.org",
    relevanceScore: 0.8,
    whyItMatches: "Great for building projects, networking, and gaining hackathon experience",
    stipend: "Free",
    requirements: ["Current student"],
    benefits: ["Prizes", "Networking", "Portfolio building"],
    acceptanceRate: 0.3,
    isVerified: true,
  },
  {
    title: "Stripe Internship",
    organization: "Stripe",
    description: "Work on payment infrastructure used by millions of businesses.",
    category: "Internship",
    careerCategories: ["software_engineer"],
    skillRelevance: ["Python", "JavaScript", "APIs", "Payment Systems"],
    difficulty: "intermediate",
    deadline: new Date("2026-03-15"),
    location: "San Francisco, CA / Remote",
    timeCommitment: "Full-time (12 weeks)",
    applicationLink: "https://stripe.com/jobs",
    relevanceScore: 0.9,
    whyItMatches: "Learn about payment infrastructure and work with world-class engineers",
    stipend: "$30-$40/hour",
    requirements: ["Strong programming skills", "Familiarity with APIs"],
    benefits: ["Competitive salary", "Mentorship", "Full-time offer potential"],
    acceptanceRate: 0.08,
    isVerified: true,
  },
  // Data Scientist opportunities
  {
    title: "Kaggle Competitions",
    organization: "Kaggle",
    description: "Compete in machine learning competitions and win prizes.",
    category: "Competition",
    careerCategories: ["data_scientist", "software_engineer"],
    skillRelevance: ["Python", "Machine Learning", "Data Analysis"],
    difficulty: "intermediate",
    deadline: null,
    location: "Remote",
    timeCommitment: "Flexible",
    applicationLink: "https://kaggle.com",
    relevanceScore: 0.85,
    whyItMatches: "Build portfolio and learn from top data scientists",
    stipend: "Prizes vary",
    requirements: ["Basic machine learning knowledge"],
    benefits: ["Portfolio building", "Prizes", "Networking"],
    acceptanceRate: 1.0,
    isVerified: true,
  },
  {
    title: "Andrew Ng's Machine Learning Specialization",
    organization: "Coursera / DeepLearning.AI",
    description: "Learn machine learning from one of the field's leading experts.",
    category: "Certification",
    careerCategories: ["data_scientist"],
    skillRelevance: ["Python", "Machine Learning", "Deep Learning"],
    difficulty: "intermediate",
    deadline: null,
    location: "Remote",
    timeCommitment: "3-4 months",
    applicationLink: "https://www.deeplearning.ai",
    relevanceScore: 0.88,
    whyItMatches: "Industry-standard ML curriculum from a leading expert",
    stipend: "Free / Paid ($39-$99)",
    requirements: ["Basic Python knowledge"],
    benefits: ["Certificate", "Portfolio projects", "Job-ready skills"],
    acceptanceRate: 1.0,
    isVerified: true,
  },
  // General opportunities
  {
    title: "Fullbright Scholarship",
    organization: "U.S. Department of State",
    description: "Study abroad and represent the United States in educational exchange.",
    category: "Scholarship",
    careerCategories: ["software_engineer", "data_scientist"],
    skillRelevance: ["Leadership", "Communication", "Global perspective"],
    difficulty: "advanced",
    deadline: new Date("2026-10-15"),
    location: "Varies",
    timeCommitment: "1 year",
    applicationLink: "https://fulbright.org",
    relevanceScore: 0.7,
    whyItMatches: "Gain international experience and build global network",
    stipend: "Full funding",
    requirements: ["U.S. citizen", "Bachelor's degree", "Strong academics"],
    benefits: ["Full funding", "International experience", "Networking"],
    acceptanceRate: 0.15,
    isVerified: true,
  },
  {
    title: "Y Combinator Startup School",
    organization: "Y Combinator",
    description: "Learn how to start a startup from Y Combinator partners.",
    category: "Program",
    careerCategories: ["software_engineer", "entrepreneur"],
    skillRelevance: ["Entrepreneurship", "Business", "Product Development"],
    difficulty: "beginner",
    deadline: null,
    location: "Remote",
    timeCommitment: "4 weeks",
    applicationLink: "https://startupschool.org",
    relevanceScore: 0.75,
    whyItMatches: "Learn startup fundamentals from experienced founders",
    stipend: "Free",
    requirements: ["Interest in startups"],
    benefits: ["Education", "Networking", "Potential funding"],
    acceptanceRate: 1.0,
    isVerified: true,
  },
];
