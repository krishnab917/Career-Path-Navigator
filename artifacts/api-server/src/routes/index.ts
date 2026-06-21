import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import simulationsRouter from "./simulations";
import simulationSessionsRouter from "./simulation-sessions";
import analysisRouter from "./analysis";
import opportunitiesRouter from "./opportunities";
import roadmapRouter from "./roadmap";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(simulationsRouter);
router.use(simulationSessionsRouter);
router.use(analysisRouter);
router.use(opportunitiesRouter);
router.use(roadmapRouter);
router.use(dashboardRouter);

export default router;
