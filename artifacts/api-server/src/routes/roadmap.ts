import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, roadmapMilestonesTable, careerAnalysesTable, simulationSessionsTable, profilesTable } from "@workspace/db";
import { GetRoadmapResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const DEMO_PROFILE_ID = 1;

router.get("/roadmap", async (req, res): Promise<void> => {
  // Get most recent completed analysis to determine target career
  const sessions = await db
    .select()
    .from(simulationSessionsTable)
    .where(eq(simulationSessionsTable.profileId, DEMO_PROFILE_ID));

  let targetCareer = "Software Engineer";
  let targetCareerCategory = "Software Engineering";

  for (const session of sessions) {
    if (session.status === "completed") {
      const [analysis] = await db
        .select()
        .from(careerAnalysesTable)
        .where(eq(careerAnalysesTable.sessionId, session.id));
      if (analysis) {
        targetCareer = analysis.primaryCareer;
        targetCareerCategory = analysis.primaryCareerCategory;
        break;
      }
    }
  }

  // Find roadmap milestones for this career
  const milestones = await db
    .select()
    .from(roadmapMilestonesTable)
    .where(eq(roadmapMilestonesTable.careerCategory, targetCareerCategory))
    .orderBy(roadmapMilestonesTable.sortOrder);

  const fallback = await db
    .select()
    .from(roadmapMilestonesTable)
    .where(eq(roadmapMilestonesTable.careerCategory, "Technology"))
    .orderBy(roadmapMilestonesTable.sortOrder);

  const usedMilestones = milestones.length > 0 ? milestones : fallback;

  // Group into phases
  const phaseMap = new Map<string, { name: string; timeframe: string; focus: string }>();
  for (const m of usedMilestones) {
    if (!phaseMap.has(m.phase)) {
      phaseMap.set(m.phase, { name: m.phase, timeframe: m.phaseTimeframe, focus: m.phaseFocus });
    }
  }

  res.json(GetRoadmapResponse.parse({
    targetCareer,
    targetCareerCategory,
    milestones: usedMilestones.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      timeframe: m.timeframe,
      description: m.description,
      priority: m.priority,
      resources: m.resources,
    })),
    phases: Array.from(phaseMap.values()),
  }));
});

export default router;
