import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, simulationsTable } from "@workspace/db";
import {
  GetSimulationParams,
  GetSimulationResponse,
  ListSimulationsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatSimulation(sim: typeof simulationsTable.$inferSelect) {
  return {
    id: sim.id,
    title: sim.title,
    careerCategory: sim.careerCategory,
    difficulty: sim.difficulty,
    estimatedMinutes: sim.estimatedMinutes,
    description: sim.description,
    tagline: sim.tagline ?? null,
    skills: sim.skills,
    stages: sim.stages,
    completionCount: sim.completionCount,
    coverColor: sim.coverColor ?? null,
  };
}

router.get("/simulations", async (_req, res): Promise<void> => {
  const sims = await db.select().from(simulationsTable).orderBy(simulationsTable.id);
  res.json(ListSimulationsResponse.parse(sims.map(formatSimulation)));
});

router.get("/simulations/:simulationId", async (req, res): Promise<void> => {
  const params = GetSimulationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [sim] = await db
    .select()
    .from(simulationsTable)
    .where(eq(simulationsTable.id, params.data.simulationId));

  if (!sim) {
    res.status(404).json({ error: "Simulation not found" });
    return;
  }

  res.json(GetSimulationResponse.parse(formatSimulation(sim)));
});

export default router;
