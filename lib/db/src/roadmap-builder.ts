/**
 * Roadmap Builder Service
 * Provides Notion-like functionality for building and managing career roadmaps
 * Supports drag-and-drop organization, timeline views, and opportunity integration
 */

export interface RoadmapPhase {
  id: string;
  name: string;
  timeframe: string; // e.g., "Summer 2024", "Fall 2024", "Year 1"
  focus: string; // e.g., "Foundation", "Growth", "Specialization"
  description: string;
  order: number;
}

export interface RoadmapMilestone {
  id: string;
  phaseId: string;
  title: string;
  type: "academic" | "competition" | "research" | "project" | "internship" | "skill" | "custom";
  description: string;
  priority: "low" | "medium" | "high";
  status: "not_started" | "in_progress" | "completed";
  dueDate?: Date;
  estimatedHours?: number;
  resources: string[]; // URLs, file paths, etc.
  notes: string;
  order: number;
  isAiSuggested: boolean;
  aiMilestoneId?: number;
}

export interface RoadmapTimeline {
  phases: RoadmapPhase[];
  milestones: RoadmapMilestone[];
  totalDuration: string; // e.g., "2 years"
  completionPercentage: number;
}

export interface RoadmapTemplate {
  name: string;
  description: string;
  careerPath: string;
  phases: RoadmapPhase[];
  suggestedMilestones: RoadmapMilestone[];
}

/**
 * Create a new roadmap phase
 */
export function createPhase(
  name: string,
  timeframe: string,
  focus: string,
  description: string,
  order: number
): RoadmapPhase {
  return {
    id: `phase_${Date.now()}`,
    name,
    timeframe,
    focus,
    description,
    order,
  };
}

/**
 * Create a new milestone
 */
export function createMilestone(
  phaseId: string,
  title: string,
  type: RoadmapMilestone["type"],
  description: string,
  priority: RoadmapMilestone["priority"],
  order: number,
  isAiSuggested: boolean = false
): RoadmapMilestone {
  return {
    id: `milestone_${Date.now()}`,
    phaseId,
    title,
    type,
    description,
    priority,
    status: "not_started",
    resources: [],
    notes: "",
    order,
    isAiSuggested,
  };
}

/**
 * Generate a roadmap template for a specific career path
 */
export function generateRoadmapTemplate(careerPath: string): RoadmapTemplate {
  const templates: Record<string, RoadmapTemplate> = {
    software_engineer: {
      name: "Software Engineer Career Path",
      description: "A comprehensive roadmap to become a successful software engineer",
      careerPath: "software_engineer",
      phases: [
        createPhase(
          "Foundation",
          "Months 1-3",
          "Build core programming skills",
          "Master fundamentals of programming, data structures, and algorithms",
          1
        ),
        createPhase(
          "Growth",
          "Months 4-8",
          "Gain practical experience",
          "Build projects, contribute to open source, and gain real-world experience",
          2
        ),
        createPhase(
          "Specialization",
          "Months 9-12",
          "Specialize in a domain",
          "Choose a specialization (web, mobile, systems, etc.) and deepen expertise",
          3
        ),
        createPhase(
          "Career Launch",
          "Months 13+",
          "Secure internship or entry-level role",
          "Apply for internships or entry-level positions and land your first role",
          4
        ),
      ],
      suggestedMilestones: [
        createMilestone(
          "phase_1",
          "Complete Python Fundamentals Course",
          "skill",
          "Master Python basics through a structured course",
          "high",
          1,
          true
        ),
        createMilestone(
          "phase_1",
          "Learn Data Structures & Algorithms",
          "skill",
          "Study fundamental data structures and algorithm design",
          "high",
          2,
          true
        ),
        createMilestone(
          "phase_2",
          "Build 3 Personal Projects",
          "project",
          "Create projects showcasing different skills",
          "high",
          3,
          true
        ),
        createMilestone(
          "phase_2",
          "Contribute to Open Source",
          "project",
          "Make meaningful contributions to open source projects",
          "medium",
          4,
          true
        ),
        createMilestone(
          "phase_3",
          "Specialize in Web Development",
          "skill",
          "Learn React, Node.js, and full-stack development",
          "high",
          5,
          true
        ),
        createMilestone(
          "phase_4",
          "Apply for Internships",
          "internship",
          "Apply to summer internship programs at tech companies",
          "high",
          6,
          true
        ),
      ],
    },
    data_scientist: {
      name: "Data Scientist Career Path",
      description: "A comprehensive roadmap to become a successful data scientist",
      careerPath: "data_scientist",
      phases: [
        createPhase(
          "Foundation",
          "Months 1-3",
          "Build math and programming skills",
          "Master linear algebra, statistics, and Python programming",
          1
        ),
        createPhase(
          "Core Skills",
          "Months 4-8",
          "Learn machine learning",
          "Study machine learning algorithms, feature engineering, and model evaluation",
          2
        ),
        createPhase(
          "Specialization",
          "Months 9-12",
          "Specialize in a domain",
          "Choose a specialization (NLP, Computer Vision, Recommender Systems, etc.)",
          3
        ),
        createPhase(
          "Career Launch",
          "Months 13+",
          "Secure data science role",
          "Build portfolio and apply for data science positions",
          4
        ),
      ],
      suggestedMilestones: [
        createMilestone(
          "phase_1",
          "Master Linear Algebra & Statistics",
          "skill",
          "Study mathematical foundations for data science",
          "high",
          1,
          true
        ),
        createMilestone(
          "phase_1",
          "Learn Python for Data Science",
          "skill",
          "Master NumPy, Pandas, and Matplotlib",
          "high",
          2,
          true
        ),
        createMilestone(
          "phase_2",
          "Complete Machine Learning Course",
          "skill",
          "Study supervised and unsupervised learning algorithms",
          "high",
          3,
          true
        ),
        createMilestone(
          "phase_2",
          "Participate in Kaggle Competitions",
          "competition",
          "Build portfolio through machine learning competitions",
          "medium",
          4,
          true
        ),
        createMilestone(
          "phase_3",
          "Specialize in NLP or Computer Vision",
          "skill",
          "Deep dive into your chosen specialization",
          "high",
          5,
          true
        ),
        createMilestone(
          "phase_4",
          "Apply for Data Science Internships",
          "internship",
          "Apply to data science programs at tech companies",
          "high",
          6,
          true
        ),
      ],
    },
    entrepreneur: {
      name: "Entrepreneur Career Path",
      description: "A comprehensive roadmap to launch your startup",
      careerPath: "entrepreneur",
      phases: [
        createPhase(
          "Ideation",
          "Months 1-2",
          "Develop and validate your idea",
          "Research market, identify problem, and validate product-market fit",
          1
        ),
        createPhase(
          "MVP Development",
          "Months 3-6",
          "Build minimum viable product",
          "Create MVP and gather user feedback",
          2
        ),
        createPhase(
          "Growth",
          "Months 7-12",
          "Scale and fundraise",
          "Grow user base and prepare for fundraising",
          3
        ),
        createPhase(
          "Scaling",
          "Months 13+",
          "Scale operations",
          "Build team, secure funding, and scale operations",
          4
        ),
      ],
      suggestedMilestones: [
        createMilestone(
          "phase_1",
          "Validate Business Idea",
          "research",
          "Interview 50+ potential customers",
          "high",
          1,
          true
        ),
        createMilestone(
          "phase_1",
          "Create Business Plan",
          "custom",
          "Develop comprehensive business plan",
          "high",
          2,
          true
        ),
        createMilestone(
          "phase_2",
          "Build MVP",
          "project",
          "Develop minimum viable product",
          "high",
          3,
          true
        ),
        createMilestone(
          "phase_2",
          "Launch Beta",
          "custom",
          "Launch beta version and gather feedback",
          "high",
          4,
          true
        ),
        createMilestone(
          "phase_3",
          "Reach 1000 Users",
          "custom",
          "Grow user base to 1000 active users",
          "high",
          5,
          true
        ),
        createMilestone(
          "phase_4",
          "Raise Seed Funding",
          "custom",
          "Secure seed funding from investors",
          "high",
          6,
          true
        ),
      ],
    },
  };

  return templates[careerPath] || templates.software_engineer;
}

/**
 * Calculate roadmap completion percentage
 */
export function calculateCompletionPercentage(milestones: RoadmapMilestone[]): number {
  if (milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.status === "completed").length;
  return Math.round((completed / milestones.length) * 100);
}

/**
 * Get milestones by priority
 */
export function getMilestonesByPriority(
  milestones: RoadmapMilestone[],
  priority: RoadmapMilestone["priority"]
): RoadmapMilestone[] {
  return milestones.filter((m) => m.priority === priority).sort((a, b) => a.order - b.order);
}

/**
 * Get milestones by status
 */
export function getMilestonesByStatus(
  milestones: RoadmapMilestone[],
  status: RoadmapMilestone["status"]
): RoadmapMilestone[] {
  return milestones.filter((m) => m.status === status).sort((a, b) => a.order - b.order);
}

/**
 * Get milestones by phase
 */
export function getMilestonesByPhase(
  milestones: RoadmapMilestone[],
  phaseId: string
): RoadmapMilestone[] {
  return milestones.filter((m) => m.phaseId === phaseId).sort((a, b) => a.order - b.order);
}

/**
 * Add opportunity to roadmap as a milestone
 */
export function addOpportunityToRoadmap(
  phaseId: string,
  opportunityTitle: string,
  opportunityId: number,
  order: number
): RoadmapMilestone {
  return {
    id: `opportunity_${opportunityId}`,
    phaseId,
    title: opportunityTitle,
    type: "internship",
    description: `Opportunity: ${opportunityTitle}`,
    priority: "medium",
    status: "not_started",
    resources: [],
    notes: "",
    order,
    isAiSuggested: false,
    aiMilestoneId: opportunityId,
  };
}

/**
 * Reorder milestones within a phase (drag and drop)
 */
export function reorderMilestones(
  milestones: RoadmapMilestone[],
  milestoneId: string,
  newOrder: number
): RoadmapMilestone[] {
  const milestone = milestones.find((m) => m.id === milestoneId);
  if (!milestone) return milestones;

  const phaseId = milestone.phaseId;
  const phaseMilestones = milestones.filter((m) => m.phaseId === phaseId);
  const otherMilestones = milestones.filter((m) => m.phaseId !== phaseId);

  // Remove the milestone from its current position
  const filtered = phaseMilestones.filter((m) => m.id !== milestoneId);

  // Insert it at the new position
  filtered.splice(newOrder, 0, milestone);

  // Update order values
  filtered.forEach((m, index) => {
    m.order = index + 1;
  });

  return [...otherMilestones, ...filtered];
}

/**
 * Generate AI-suggested roadmap based on career match and behavioral profile
 */
export function generateAiRoadmap(
  careerPath: string,
  behavioralProfile: Record<string, number>
): RoadmapTemplate {
  const template = generateRoadmapTemplate(careerPath);

  // Customize based on behavioral profile
  if (behavioralProfile.riskTolerance > 70) {
    // Add more ambitious milestones
    template.suggestedMilestones.push(
      createMilestone(
        template.phases[1].id,
        "Launch Side Project",
        "project",
        "Launch your own project or startup idea",
        "high",
        template.suggestedMilestones.length + 1,
        true
      )
    );
  }

  if (behavioralProfile.leadership > 70) {
    // Add leadership-focused milestones
    template.suggestedMilestones.push(
      createMilestone(
        template.phases[2].id,
        "Lead a Team Project",
        "project",
        "Lead a team on a significant project",
        "high",
        template.suggestedMilestones.length + 1,
        true
      )
    );
  }

  if (behavioralProfile.communication > 70) {
    // Add communication-focused milestones
    template.suggestedMilestones.push(
      createMilestone(
        template.phases[1].id,
        "Present at Conference or Meetup",
        "custom",
        "Share your knowledge with the community",
        "medium",
        template.suggestedMilestones.length + 1,
        true
      )
    );
  }

  return template;
}

/**
 * Export roadmap as timeline JSON
 */
export function exportRoadmapTimeline(
  phases: RoadmapPhase[],
  milestones: RoadmapMilestone[]
): RoadmapTimeline {
  const completionPercentage = calculateCompletionPercentage(milestones);

  return {
    phases: phases.sort((a, b) => a.order - b.order),
    milestones: milestones.sort((a, b) => a.order - b.order),
    totalDuration: `${phases.length} phases`,
    completionPercentage,
  };
}
