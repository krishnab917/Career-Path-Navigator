import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import {
  db,
  roadmapMilestonesTable,
  careerAnalysesTable,
  simulationSessionsTable,
  userRoadmapItemsTable,
} from "@workspace/db";
import {
  GetRoadmapResponse,
  ListRoadmapItemsResponseItem,
  CreateRoadmapItemBody,
  UpdateRoadmapItemBody,
  UpdateRoadmapItemParams,
  DeleteRoadmapItemParams,
  UpdateRoadmapItemResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const DEMO_PROFILE_ID = 1;

async function getTargetCareer() {
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
  return { targetCareer, targetCareerCategory };
}

function formatItem(item: typeof userRoadmapItemsTable.$inferSelect) {
  return {
    id: item.id,
    profileId: item.profileId,
    title: item.title,
    type: item.type,
    phase: item.phase,
    description: item.description,
    notes: item.notes ?? null,
    status: item.status as "accepted" | "custom" | "skipped",
    isCompleted: item.isCompleted,
    isUserCreated: item.isUserCreated,
    aiMilestoneId: item.aiMilestoneId ?? null,
    sortOrder: item.sortOrder,
    resources: item.resources,
    createdAt: item.createdAt.toISOString(),
  };
}

// GET /roadmap — AI suggestions (roadmap milestones) with user's career context
router.get("/roadmap", async (req, res): Promise<void> => {
  const { targetCareer, targetCareerCategory } = await getTargetCareer();

  let milestones = await db
    .select()
    .from(roadmapMilestonesTable)
    .where(eq(roadmapMilestonesTable.careerCategory, targetCareerCategory))
    .orderBy(roadmapMilestonesTable.sortOrder);

  if (milestones.length === 0) {
    milestones = await db
      .select()
      .from(roadmapMilestonesTable)
      .where(eq(roadmapMilestonesTable.careerCategory, "Technology"))
      .orderBy(roadmapMilestonesTable.sortOrder);
  }

  // Get which milestones the user has already accepted or skipped
  const userItems = await db
    .select()
    .from(userRoadmapItemsTable)
    .where(eq(userRoadmapItemsTable.profileId, DEMO_PROFILE_ID));

  const acceptedIds = new Set(userItems.filter((i) => i.aiMilestoneId !== null && i.status !== "skipped").map((i) => i.aiMilestoneId));
  const skippedIds = new Set(userItems.filter((i) => i.status === "skipped" && i.aiMilestoneId !== null).map((i) => i.aiMilestoneId));

  const phaseMap = new Map<string, { name: string; timeframe: string; focus: string }>();
  for (const m of milestones) {
    if (!phaseMap.has(m.phase)) {
      phaseMap.set(m.phase, { name: m.phase, timeframe: m.phaseTimeframe, focus: m.phaseFocus });
    }
  }

  res.json(GetRoadmapResponse.parse({
    targetCareer,
    targetCareerCategory,
    milestones: milestones.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      timeframe: m.timeframe,
      phase: m.phase,
      description: m.description,
      priority: m.priority,
      resources: m.resources,
      accepted: acceptedIds.has(m.id),
      skipped: skippedIds.has(m.id),
    })),
    phases: Array.from(phaseMap.values()),
  }));
});

// GET /roadmap/items — user's accepted + custom items
router.get("/roadmap/items", async (req, res): Promise<void> => {
  const items = await db
    .select()
    .from(userRoadmapItemsTable)
    .where(
      and(
        eq(userRoadmapItemsTable.profileId, DEMO_PROFILE_ID),
        eq(userRoadmapItemsTable.status, "accepted"),
      ),
    )
    .orderBy(userRoadmapItemsTable.sortOrder);

  const customItems = await db
    .select()
    .from(userRoadmapItemsTable)
    .where(
      and(
        eq(userRoadmapItemsTable.profileId, DEMO_PROFILE_ID),
        eq(userRoadmapItemsTable.status, "custom"),
      ),
    )
    .orderBy(userRoadmapItemsTable.sortOrder);

  res.json([...items, ...customItems].map((item) => ListRoadmapItemsResponseItem.parse(formatItem(item))));
});

// POST /roadmap/items — accept AI suggestion or create custom milestone
router.post("/roadmap/items", async (req, res): Promise<void> => {
  const parsed = CreateRoadmapItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Count existing items for sort order
  const existing = await db
    .select()
    .from(userRoadmapItemsTable)
    .where(eq(userRoadmapItemsTable.profileId, DEMO_PROFILE_ID));

  const [item] = await db
    .insert(userRoadmapItemsTable)
    .values({
      profileId: DEMO_PROFILE_ID,
      title: parsed.data.title,
      type: parsed.data.type ?? "skill",
      phase: parsed.data.phase ?? "Now",
      description: parsed.data.description ?? "",
      notes: parsed.data.notes ?? null,
      status: parsed.data.isUserCreated ? "custom" : "accepted",
      isUserCreated: parsed.data.isUserCreated ?? false,
      aiMilestoneId: parsed.data.aiMilestoneId ?? null,
      sortOrder: existing.length,
      resources: parsed.data.resources ?? [],
    })
    .returning();

  res.status(201).json(ListRoadmapItemsResponseItem.parse(formatItem(item)));
});

// PATCH /roadmap/items/:itemId — toggle complete, skip, edit
router.patch("/roadmap/items/:itemId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
  const itemId = parseInt(raw, 10);

  const params = UpdateRoadmapItemParams.safeParse({ itemId });
  if (!params.success || isNaN(itemId)) {
    res.status(400).json({ error: "Invalid item ID" });
    return;
  }

  const parsed = UpdateRoadmapItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db
    .update(userRoadmapItemsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(
      and(
        eq(userRoadmapItemsTable.id, itemId),
        eq(userRoadmapItemsTable.profileId, DEMO_PROFILE_ID),
      ),
    )
    .returning();

  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  res.json(UpdateRoadmapItemResponse.parse(formatItem(item)));
});

// DELETE /roadmap/items/:itemId
router.delete("/roadmap/items/:itemId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
  const itemId = parseInt(raw, 10);

  const params = DeleteRoadmapItemParams.safeParse({ itemId });
  if (!params.success || isNaN(itemId)) {
    res.status(400).json({ error: "Invalid item ID" });
    return;
  }

  await db
    .delete(userRoadmapItemsTable)
    .where(
      and(
        eq(userRoadmapItemsTable.id, itemId),
        eq(userRoadmapItemsTable.profileId, DEMO_PROFILE_ID),
      ),
    );

  res.status(204).send();
});

export default router;
