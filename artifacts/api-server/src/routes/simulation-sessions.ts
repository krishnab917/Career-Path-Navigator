import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, simulationSessionsTable, simulationsTable, decisionsTable, careerAnalysesTable } from "@workspace/db";
import {
  CreateSimulationSessionBody,
  SubmitDecisionBody,
  SubmitDecisionParams,
  GetSimulationSessionParams,
  CompleteSimulationSessionParams,
  GetSimulationSessionResponse,
  ListSimulationSessionsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const DEMO_PROFILE_ID = 1;

type Metrics = {
  analyticalThinking: number;
  communication: number;
  problemSolving: number;
  leadership: number;
  adaptability: number;
};

type Choice = {
  id: string;
  text: string;
  risk: string;
  hint?: string | null;
};

type Scenario = {
  stageNumber: number;
  title: string;
  description: string;
  context: string;
  timeLimit?: number | null;
  choices: Choice[];
};

function clamp(val: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

function applyMetricImpact(metrics: Metrics, choice: Choice): { metrics: Metrics; impact: number } {
  const delta = choice.risk === "high" ? 12 : choice.risk === "medium" ? 6 : 3;
  const positive = Math.random() > (choice.risk === "high" ? 0.4 : choice.risk === "medium" ? 0.25 : 0.1);
  const sign = positive ? 1 : -1;

  const updated: Metrics = {
    analyticalThinking: clamp(metrics.analyticalThinking + sign * delta * (0.8 + Math.random() * 0.4)),
    communication: clamp(metrics.communication + sign * delta * (0.8 + Math.random() * 0.4) * 0.8),
    problemSolving: clamp(metrics.problemSolving + sign * delta * (0.8 + Math.random() * 0.4)),
    leadership: clamp(metrics.leadership + sign * delta * (0.8 + Math.random() * 0.4) * 0.7),
    adaptability: clamp(metrics.adaptability + sign * delta * (0.8 + Math.random() * 0.4) * 0.9),
  };

  const scoreImpact = sign * (delta * 2);
  return { metrics: updated, impact: scoreImpact };
}

function getConsequence(choice: Choice, positive: boolean): string {
  const consequences: Record<string, { pos: string; neg: string }> = {
    low: {
      pos: "Your cautious approach paid off. The team appreciated the measured response.",
      neg: "The conservative choice kept things stable but missed an opportunity for growth.",
    },
    medium: {
      pos: "The balanced decision moved things forward effectively. Stakeholders are satisfied.",
      neg: "The approach had mixed results. Some issues emerged but were manageable.",
    },
    high: {
      pos: "The bold move worked. You demonstrated strong conviction and it delivered results.",
      neg: "The high-risk approach backfired. The team had to recover from unexpected complications.",
    },
  };
  const entry = consequences[choice.risk] ?? consequences.medium;
  const positive2 = Math.random() > 0.3;
  return positive2 ? entry.pos : entry.neg;
}

async function formatSession(session: typeof simulationSessionsTable.$inferSelect, simulation: typeof simulationsTable.$inferSelect | null) {
  const decisionsRows = await db
    .select()
    .from(decisionsTable)
    .where(eq(decisionsTable.sessionId, session.id))
    .orderBy(decisionsTable.stageNumber);

  const scenarios = (simulation?.scenariosData ?? []) as Scenario[];
  const currentScenario = scenarios.find((s) => s.stageNumber === session.currentStage) ?? null;
  const metrics = session.metricsData as Metrics;

  return {
    id: session.id,
    simulationId: session.simulationId,
    simulationTitle: simulation?.title ?? null,
    status: session.status,
    currentStage: session.currentStage,
    totalStages: session.totalStages,
    score: session.score,
    decisions: decisionsRows.map((d) => ({
      id: d.id,
      sessionId: d.sessionId,
      stageNumber: d.stageNumber,
      choiceId: d.choiceId,
      choiceText: d.choiceText,
      consequence: d.consequence,
      scoreImpact: d.scoreImpact,
    })),
    metrics: {
      analyticalThinking: metrics.analyticalThinking,
      communication: metrics.communication,
      problemSolving: metrics.problemSolving,
      leadership: metrics.leadership,
      adaptability: metrics.adaptability,
    },
    currentScenario: currentScenario ? {
      stageNumber: currentScenario.stageNumber,
      title: currentScenario.title,
      description: currentScenario.description,
      context: currentScenario.context,
      timeLimit: currentScenario.timeLimit ?? null,
      choices: currentScenario.choices.map((c) => ({
        id: c.id,
        text: c.text,
        risk: c.risk,
        hint: c.hint ?? null,
      })),
    } : null,
    createdAt: session.createdAt.toISOString(),
    completedAt: session.completedAt?.toISOString() ?? null,
  };
}

router.get("/simulation-sessions", async (req, res): Promise<void> => {
  const sessions = await db
    .select()
    .from(simulationSessionsTable)
    .where(eq(simulationSessionsTable.profileId, DEMO_PROFILE_ID))
    .orderBy(simulationSessionsTable.createdAt);

  const result = await Promise.all(sessions.map(async (session) => {
    const [simulation] = await db.select().from(simulationsTable).where(eq(simulationsTable.id, session.simulationId));
    return formatSession(session, simulation ?? null);
  }));

  res.json(ListSimulationSessionsResponse.parse(result));
});

router.post("/simulation-sessions", async (req, res): Promise<void> => {
  const parsed = CreateSimulationSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [simulation] = await db
    .select()
    .from(simulationsTable)
    .where(eq(simulationsTable.id, parsed.data.simulationId));

  if (!simulation) {
    res.status(404).json({ error: "Simulation not found" });
    return;
  }

  const [session] = await db
    .insert(simulationSessionsTable)
    .values({
      simulationId: parsed.data.simulationId,
      profileId: DEMO_PROFILE_ID,
      status: "active",
      currentStage: 1,
      totalStages: simulation.stages,
      score: 0,
      metricsData: { analyticalThinking: 50, communication: 50, problemSolving: 50, leadership: 50, adaptability: 50 },
    })
    .returning();

  res.status(201).json(GetSimulationSessionResponse.parse(await formatSession(session, simulation)));
});

router.get("/simulation-sessions/:sessionId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const sessionId = parseInt(raw, 10);

  const params = GetSimulationSessionParams.safeParse({ sessionId });
  if (!params.success || isNaN(sessionId)) {
    res.status(400).json({ error: "Invalid session ID" });
    return;
  }

  const [session] = await db
    .select()
    .from(simulationSessionsTable)
    .where(and(eq(simulationSessionsTable.id, sessionId), eq(simulationSessionsTable.profileId, DEMO_PROFILE_ID)));

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const [simulation] = await db.select().from(simulationsTable).where(eq(simulationsTable.id, session.simulationId));

  res.json(GetSimulationSessionResponse.parse(await formatSession(session, simulation ?? null)));
});

router.post("/simulation-sessions/:sessionId/decisions", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const sessionId = parseInt(raw, 10);

  const params = SubmitDecisionParams.safeParse({ sessionId });
  if (!params.success || isNaN(sessionId)) {
    res.status(400).json({ error: "Invalid session ID" });
    return;
  }

  const parsed = SubmitDecisionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [session] = await db
    .select()
    .from(simulationSessionsTable)
    .where(and(eq(simulationSessionsTable.id, sessionId), eq(simulationSessionsTable.profileId, DEMO_PROFILE_ID)));

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  if (session.status !== "active") {
    res.status(400).json({ error: "Session is not active" });
    return;
  }

  const [simulation] = await db.select().from(simulationsTable).where(eq(simulationsTable.id, session.simulationId));
  const scenarios = (simulation?.scenariosData ?? []) as Scenario[];
  const currentScenario = scenarios.find((s) => s.stageNumber === parsed.data.stageNumber);

  const choice = currentScenario?.choices.find((c) => c.id === parsed.data.choiceId) ?? {
    id: parsed.data.choiceId,
    text: "Custom choice",
    risk: "medium",
    hint: null,
  };

  const currentMetrics = session.metricsData as Metrics;
  const { metrics: updatedMetrics, impact } = applyMetricImpact(currentMetrics, choice);
  const positive = impact > 0;
  const consequence = getConsequence(choice, positive);
  const newScore = Math.max(0, session.score + impact);

  await db.insert(decisionsTable).values({
    sessionId,
    stageNumber: parsed.data.stageNumber,
    choiceId: parsed.data.choiceId,
    choiceText: choice.text,
    consequence,
    scoreImpact: impact,
  });

  const nextStage = session.currentStage + 1;
  const isComplete = nextStage > session.totalStages;

  const [updatedSession] = await db
    .update(simulationSessionsTable)
    .set({
      currentStage: isComplete ? session.currentStage : nextStage,
      score: newScore,
      metricsData: updatedMetrics,
      status: isComplete ? "completed" : "active",
      completedAt: isComplete ? new Date() : null,
    })
    .where(eq(simulationSessionsTable.id, sessionId))
    .returning();

  if (isComplete) {
    // Auto-generate analysis
    await generateAnalysis(sessionId, simulation, updatedMetrics, newScore);
  }

  res.json(GetSimulationSessionResponse.parse(await formatSession(updatedSession, simulation ?? null)));
});

router.post("/simulation-sessions/:sessionId/complete", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const sessionId = parseInt(raw, 10);

  const params = CompleteSimulationSessionParams.safeParse({ sessionId });
  if (!params.success || isNaN(sessionId)) {
    res.status(400).json({ error: "Invalid session ID" });
    return;
  }

  const [session] = await db
    .select()
    .from(simulationSessionsTable)
    .where(and(eq(simulationSessionsTable.id, sessionId), eq(simulationSessionsTable.profileId, DEMO_PROFILE_ID)));

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const [updatedSession] = await db
    .update(simulationSessionsTable)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(simulationSessionsTable.id, sessionId))
    .returning();

  const [simulation] = await db.select().from(simulationsTable).where(eq(simulationsTable.id, session.simulationId));

  if (session.status !== "completed") {
    const metrics = session.metricsData as Metrics;
    await generateAnalysis(sessionId, simulation ?? null, metrics, session.score);
  }

  res.json(GetSimulationSessionResponse.parse(await formatSession(updatedSession, simulation ?? null)));
});

async function generateAnalysis(
  sessionId: number,
  simulation: typeof simulationsTable.$inferSelect | null,
  metrics: Metrics,
  score: number
) {
  const existing = await db.select().from(careerAnalysesTable).where(eq(careerAnalysesTable.sessionId, sessionId));
  if (existing.length > 0) return;

  const careerCategory = simulation?.careerCategory ?? "Technology";

  const careerMap: Record<string, { primary: string; secondary: string; primaryCat: string; secondaryCat: string }> = {
    "Software Engineering": { primary: "Software Engineer", secondary: "Product Manager", primaryCat: "Technology", secondaryCat: "Business" },
    "Medicine": { primary: "Physician", secondary: "Medical Researcher", primaryCat: "Healthcare", secondaryCat: "Research" },
    "Entrepreneurship": { primary: "Startup Founder", secondary: "Business Strategist", primaryCat: "Business", secondaryCat: "Business" },
    "Finance": { primary: "Investment Analyst", secondary: "Financial Advisor", primaryCat: "Finance", secondaryCat: "Finance" },
    "Law": { primary: "Corporate Attorney", secondary: "Policy Analyst", primaryCat: "Law", secondaryCat: "Public Policy" },
    "Research": { primary: "Research Scientist", secondary: "Data Scientist", primaryCat: "Research", secondaryCat: "Technology" },
  };

  const mapping = careerMap[careerCategory] ?? careerMap["Software Engineering"];
  const confidenceScore = Math.min(95, Math.max(55, 60 + score * 0.3));

  const topMetric = Object.entries(metrics).sort((a, b) => b[1] - a[1])[0][0];
  const weakMetric = Object.entries(metrics).sort((a, b) => a[1] - b[1])[0][0];

  const metricLabels: Record<string, string> = {
    analyticalThinking: "Analytical Thinking",
    communication: "Communication",
    problemSolving: "Problem Solving",
    leadership: "Leadership",
    adaptability: "Adaptability",
  };

  const behavioralInsights = [
    `You consistently favored structured, methodical approaches to complex problems.`,
    `Your decision-making showed a preference for data-driven reasoning over intuition.`,
    `Under pressure, you maintained composure and prioritized team coordination.`,
    `You demonstrated a tendency to evaluate risk carefully before committing to bold actions.`,
  ];

  const strengths = [
    metricLabels[topMetric] ?? "Analytical Thinking",
    "Strategic thinking under time constraints",
    "Ability to synthesize complex information quickly",
  ];

  const growthAreas = [
    metricLabels[weakMetric] ?? "Communication",
    "Delegating effectively to maximize team output",
    "Embracing higher-risk decisions when data supports them",
  ];

  await db.insert(careerAnalysesTable).values({
    sessionId,
    primaryCareer: mapping.primary,
    primaryCareerCategory: mapping.primaryCat,
    secondaryCareer: mapping.secondary,
    secondaryCareerCategory: mapping.secondaryCat,
    confidenceScore,
    behavioralInsights,
    strengths,
    growthAreas,
    summary: `Based on your simulation performance in ${simulation?.title ?? "this career track"}, your behavioral patterns align strongly with a career in ${mapping.primary}. You scored ${score.toFixed(0)} points across ${simulation?.stages ?? 5} stages, demonstrating ${strengths[0].toLowerCase()} as your standout attribute. The analysis of your decision patterns indicates a natural fit for roles requiring ${mapping.primaryCat.toLowerCase()} expertise.`,
    decisionPatterns: [
      "Preference for consensus-building over unilateral decisions",
      "Strong bias toward analytical frameworks when evaluating options",
      "Tendency to mitigate risk before pursuing upside opportunities",
    ],
  });
}

export default router;
