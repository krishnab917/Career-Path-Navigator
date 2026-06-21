import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, careerAnalysesTable, simulationSessionsTable } from "@workspace/db";
import { GetSessionAnalysisParams, GetSessionAnalysisResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const DEMO_PROFILE_ID = 1;

router.get("/simulation-sessions/:sessionId/analysis", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const sessionId = parseInt(raw, 10);

  const params = GetSessionAnalysisParams.safeParse({ sessionId });
  if (!params.success || isNaN(sessionId)) {
    res.status(400).json({ error: "Invalid session ID" });
    return;
  }

  // Verify session belongs to demo profile
  const [session] = await db
    .select()
    .from(simulationSessionsTable)
    .where(and(eq(simulationSessionsTable.id, sessionId), eq(simulationSessionsTable.profileId, DEMO_PROFILE_ID)));

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const [analysis] = await db
    .select()
    .from(careerAnalysesTable)
    .where(eq(careerAnalysesTable.sessionId, sessionId));

  if (!analysis) {
    res.status(404).json({ error: "Analysis not yet available. Complete the simulation first." });
    return;
  }

  res.json(GetSessionAnalysisResponse.parse({
    id: analysis.id,
    sessionId: analysis.sessionId,
    primaryCareer: analysis.primaryCareer,
    primaryCareerCategory: analysis.primaryCareerCategory,
    secondaryCareer: analysis.secondaryCareer,
    secondaryCareerCategory: analysis.secondaryCareerCategory,
    confidenceScore: analysis.confidenceScore,
    behavioralInsights: analysis.behavioralInsights,
    strengths: analysis.strengths,
    growthAreas: analysis.growthAreas,
    summary: analysis.summary,
    decisionPatterns: analysis.decisionPatterns,
  }));
});

export default router;
