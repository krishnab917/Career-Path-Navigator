import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import {
  CreateProfileBody,
  UpdateProfileBody,
  GetProfileResponse,
  UpdateProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Hardcoded profile id=1 for single-user demo
const DEMO_PROFILE_ID = 1;

router.get("/profile", async (req, res): Promise<void> => {
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, DEMO_PROFILE_ID));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(GetProfileResponse.parse({
    ...profile,
    createdAt: profile.createdAt.toISOString(),
  }));
});

router.post("/profile", async (req, res): Promise<void> => {
  const parsed = CreateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid profile body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, DEMO_PROFILE_ID));

  let profile;
  if (existing.length > 0) {
    [profile] = await db
      .update(profilesTable)
      .set({ ...parsed.data, onboardingComplete: true, updatedAt: new Date() })
      .where(eq(profilesTable.id, DEMO_PROFILE_ID))
      .returning();
  } else {
    [profile] = await db
      .insert(profilesTable)
      .values({ ...parsed.data, onboardingComplete: true })
      .returning();
  }

  res.status(201).json(GetProfileResponse.parse({
    ...profile,
    createdAt: profile.createdAt.toISOString(),
  }));
});

router.patch("/profile", async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid profile update body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [profile] = await db
    .update(profilesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(profilesTable.id, DEMO_PROFILE_ID))
    .returning();

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json(UpdateProfileResponse.parse({
    ...profile,
    createdAt: profile.createdAt.toISOString(),
  }));
});

export default router;
