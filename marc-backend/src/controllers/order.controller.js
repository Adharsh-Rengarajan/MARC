import * as orderService from "../services/order.service.js";
import { ok, created, wrap } from "../utils/response.js";

export const listAll = wrap(async (req, res) => ok(res, await orderService.listOrdersForUser(req.user)));
export const listForProject = wrap(async (req, res) =>
  ok(res, await orderService.listOrdersForProject(req.params.id, req.user))
);
export const create = wrap(async (req, res) =>
  created(res, await orderService.createMaterialOrder(req.params.id, req.body.materials, req.user), "Order requested")
);
export const approve = wrap(async (req, res) =>
  ok(res, await orderService.approveOrder(req.params.orderId, req.user), "Order approved")
);
export const reject = wrap(async (req, res) =>
  ok(res, await orderService.rejectOrder(req.params.orderId, req.body.reason, req.user), "Order rejected")
);
export const purchase = wrap(async (req, res) =>
  created(res, await orderService.createPurchaseOrder(req.params.orderId, req.body, req.user), "Purchase order placed")
);
export const markDelivered = wrap(async (req, res) =>
  ok(res, await orderService.markPurchaseOrderDelivered(req.params.purchaseOrderId, req.user), "Marked delivered")
);
export const listPurchaseOrders = wrap(async (req, res) =>
  ok(res, await orderService.listPurchaseOrders(req.user))
);
