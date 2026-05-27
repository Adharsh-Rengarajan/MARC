import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("owner"));
router.get("/", userController.list);
router.post("/", userController.create);
router.get("/:id", userController.get);
router.patch("/:id", userController.update);
router.delete("/:id", userController.remove);
export default router;
