import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import * as taskPlanController from "../controllers/taskPlan.controller.js";
import * as reportController from "../controllers/report.controller.js";
import * as orderController from "../controllers/order.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", projectController.list);
router.post("/", requireRole("owner"), projectController.create);
router.get("/:id", projectController.get);
router.patch("/:id", requireRole("owner"), projectController.update);
router.post("/:id/archive", requireRole("owner"), projectController.archive);
router.post("/:id/unarchive", requireRole("owner"), projectController.unarchive);

router.get("/:id/task-plan", taskPlanController.get);
router.put("/:id/task-plan", requireRole("manager"), taskPlanController.upsert);

router.get("/:id/reports", reportController.list);
router.post("/:id/reports", requireRole("engineer"), reportController.create);

router.get("/:id/orders", orderController.listForProject);
router.post("/:id/orders", requireRole("manager"), orderController.create);

export default router;
