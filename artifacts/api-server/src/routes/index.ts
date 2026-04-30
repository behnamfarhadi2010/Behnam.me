import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import notesRouter from "./notes";
import projectsRouter from "./projects";
import aboutRouter from "./about";
import dashboardRouter from "./dashboard";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(notesRouter);
router.use(projectsRouter);
router.use(aboutRouter);
router.use(dashboardRouter);
router.use(storageRouter);

export default router;
