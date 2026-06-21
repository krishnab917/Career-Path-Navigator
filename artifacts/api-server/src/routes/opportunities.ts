import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, opportunitiesTable } from "@workspace/db";
import {
  GetOpportunityParams,
  ListOpportunitiesQueryParams,
  GetOpportunityResponse,
  ListOpportunitiesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatOpportunity(opp: typeof opportunitiesTable.$inferSelect) {
  return {
    id: opp.id,
    title: opp.title,
    organization: opp.organization,
    category: opp.category,
    relevanceScore: opp.relevanceScore,
    whyItMatches: opp.whyItMatches,
    difficulty: opp.difficulty,
    applicationDeadline: opp.applicationDeadline,
    description: opp.description,
    stipend: opp.stipend ?? null,
    location: opp.location ?? null,
    url: opp.url ?? null,
    careerCategories: opp.careerCategories,
  };
}

router.get("/opportunities", async (req, res): Promise<void> => {
  const queryParams = ListOpportunitiesQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }

  let query = db.select().from(opportunitiesTable).$dynamic();

  if (queryParams.data.category) {
    query = query.where(eq(opportunitiesTable.category, queryParams.data.category));
  }

  const opps = await query.orderBy(opportunitiesTable.relevanceScore);
  res.json(ListOpportunitiesResponse.parse(opps.map(formatOpportunity)));
});

router.get("/opportunities/:opportunityId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.opportunityId) ? req.params.opportunityId[0] : req.params.opportunityId;
  const opportunityId = parseInt(raw, 10);

  const params = GetOpportunityParams.safeParse({ opportunityId });
  if (!params.success || isNaN(opportunityId)) {
    res.status(400).json({ error: "Invalid opportunity ID" });
    return;
  }

  const [opp] = await db
    .select()
    .from(opportunitiesTable)
    .where(eq(opportunitiesTable.id, opportunityId));

  if (!opp) {
    res.status(404).json({ error: "Opportunity not found" });
    return;
  }

  res.json(GetOpportunityResponse.parse(formatOpportunity(opp)));
});

export default router;
