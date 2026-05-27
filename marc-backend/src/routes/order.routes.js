import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", orderController.listAll);
router.get("/purchase-orders", requireRole("owner", "accountant"), orderController.listPurchaseOrders);
router.patch("/:orderId/approve", requireRole("accountant"), orderController.approve);
router.patch("/:orderId/reject", requireRole("accountant"), orderController.reject);
router.post("/:orderId/purchase", requireRole("accountant"), orderController.purchase);
router.post("/purchase-orders/:purchaseOrderId/deliver", requireRole("accountant"), orderController.markDelivered);

export default router;
