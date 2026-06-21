import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, profilesTable, simulationSessionsTable, simulationsTable, opportunitiesTable, careerAnalysesTable, decisionsTable } from "@workspace/db";
import { GetDashboardResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const DEMO_PROFILE_ID = 1;

router.get("/dashboard", async (req, res): Promise<void> => {
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, DEMO_PROFILE_ID));

  const sessions = await db
    .select()
    .from(simulationSessionsTable)
    .where(eq(simulationSessionsTable.profileId, DEMO_PROFILE_ID))
    .orderBy(simulationSessionsTable.createdAt);

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const oppsCount = await db.select().from(opportunitiesTable);

  let topCareerMatch: string | null = null;
  let topCareerConfidence: number | null = null;

  for (const session of completedSessions) {
    const [analysis] = await db
      .select()
      .from(careerAnalysesTable)
      .where(eq(careerAnalysesTable.sessionId, session.id));
    if (analysis) {
      topCareerMatch = analysis.primaryCareer;
      topCareerConfidence = analysis.confidenceScore;
      break;
    }
  }

  const recentSessions = sessions.slice(-3).reverse();
  const recentFormatted = await Promise.all(recentSessions.map(async (session) => {
    const [simulation] = await db.select().from(simulationsTable).where(eq(simulationsTable.id, session.simulationId));
    const sessionDecisions = await db.select().from(decisionsTable).where(eq(decisionsTable.sessionId, session.id));

    type Metrics = { analyticalThinking: number; communication: number; problemSolving: number; leadership: number; adaptability: number };
    const metrics = session.metricsData as Metrics;

    return {
      id: session.id,
      simulationId: session.simulationId,
      simulationTitle: simulation?.title ?? null,
      status: session.status,
      currentStage: session.currentStage,
      totalStages: session.totalStages,
      score: session.score,
      decisions: sessionDecisions.map((d) => ({
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
      currentScenario: null,
      createdAt: session.createdAt.toISOString(),
      completedAt: session.completedAt?.toISOString() ?? null,
    };
  }));

  const roadmapProgress = completedSessions.length > 0 ? Math.min(85, completedSessions.length * 20 + 10) : 0;

  res.json(GetDashboardResponse.parse({
    profileComplete: profile?.onboardingComplete ?? false,
    simulationsCompleted: completedSessions.length,
    topCareerMatch,
    topCareerConfidence,
    activeOpportunities: oppsCount.length,
    roadmapProgress,
    recentSessions: recentFormatted,
    currentStreak: completedSessions.length,
    totalScore: completedSessions.reduce((sum, s) => sum + s.score, 0),
  }));
});

export default router;
