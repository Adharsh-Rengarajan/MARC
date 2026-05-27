import { Router } from "express";
import * as taskPlanController from "../controllers/taskPlan.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.patch(
  "/:planId/days/:dayNumber/tasks/:taskId",
  requireRole("engineer", "manager"),
  taskPlanController.updateTask
);
export default router;
