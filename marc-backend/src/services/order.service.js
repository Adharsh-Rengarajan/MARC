import mongoose from "mongoose";
import { MaterialOrderModel } from "../models/materialOrder.js";
import { PurchaseOrderModel } from "../models/purchaseOrder.js";
import { ProjectModel } from "../models/project.js";
import { AppError } from "../utils/errors.js";
import { isUserAssigned } from "./project.service.js";
import {
  sanitizeMaterials, sumMaterials, subtractMaterials, computeCost,
  validateWithinAllocation, validateWithinBudget,
} from "./_materials.js";

const POPULATE_ORDER = [
  { path: "project", select: "projectName projectId location isArchived" },
  { path: "requestedBy", select: "name email" },
  { path: "approvedBy", select: "name email" },
];

const POPULATE_PO = [
  { path: "project", select: "projectName projectId" },
  { path: "placedBy", select: "name email" },
  { path: "materialOrder", select: "orderId" },
];

export const listOrdersForUser = async (user) => {
  let filter = {};
  if (user.role === "owner" || user.role === "accountant") {
    filter = {};
  } else if (user.role === "manager") {
    const projects = await ProjectModel.find({ manager: user.id }).select("_id");
    filter = { project: { $in: projects.map((p) => p._id) } };
  } else if (user.role === "engineer") {
    return [];
  }
  return MaterialOrderModel.find(filter).populate(POPULATE_ORDER).sort({ createdAt: -1 });
};

export const listOrdersForProject = async (projectId, user) => {
  if (!mongoose.isValidObjectId(projectId)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (!isUserAssigned(project, user)) throw new AppError(403, "FORBIDDEN", "Not assigned to this project");
  return MaterialOrderModel.find({ project: projectId }).populate(POPULATE_ORDER).sort({ createdAt: -1 });
};

export const createMaterialOrder = async (projectId, materialsInput, user) => {
  if (user.role !== "manager") throw new AppError(403, "FORBIDDEN", "Only managers can request orders");
  if (!mongoose.isValidObjectId(projectId)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.isArchived) throw new AppError(400, "ARCHIVED", "Project is archived");
  if (project.manager.toString() !== user.id) throw new AppError(403, "FORBIDDEN", "Not manager of this project");

  const materials = sanitizeMaterials(materialsInput);
  const totalUnits = Object.values(materials).reduce((s, v) => s + v, 0);
  if (totalUnits <= 0) throw new AppError(422, "EMPTY_ORDER", "Order must include at least one material");

  validateWithinAllocation(project, materials);

  const estimatedCost = computeCost(materials, project.unitCost || {});
  validateWithinBudget(project, estimatedCost);

  const order = await MaterialOrderModel.create({
    project: projectId,
    requestedBy: user.id,
    materials,
    estimatedCost,
  });

  project.requested = sumMaterials(project.requested || {}, materials);
  await project.save();

  return order.populate(POPULATE_ORDER);
};

export const approveOrder = async (orderId, user) => {
  if (user.role !== "accountant") throw new AppError(403, "FORBIDDEN", "Only accountants can approve");
  const order = await MaterialOrderModel.findOne({ orderId });
  if (!order) throw new AppError(404, "NOT_FOUND", "Order not found");
  if (order.status !== "requested") throw new AppError(400, "INVALID_STATE", `Cannot approve order in status ${order.status}`);
  const project = await ProjectModel.findById(order.project);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.accountant.toString() !== user.id) throw new AppError(403, "FORBIDDEN", "Not accountant of this project");

  order.status = "approved";
  order.approvedBy = user.id;
  order.approvedAt = new Date();
  await order.save();
  return order.populate(POPULATE_ORDER);
};

export const rejectOrder = async (orderId, reason, user) => {
  if (user.role !== "accountant") throw new AppError(403, "FORBIDDEN", "Only accountants can reject");
  const order = await MaterialOrderModel.findOne({ orderId });
  if (!order) throw new AppError(404, "NOT_FOUND", "Order not found");
  if (order.status !== "requested") throw new AppError(400, "INVALID_STATE", `Cannot reject order in status ${order.status}`);
  const project = await ProjectModel.findById(order.project);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.accountant.toString() !== user.id) throw new AppError(403, "FORBIDDEN", "Not accountant of this project");

  order.status = "rejected";
  order.rejectionReason = reason || "";
  order.approvedBy = user.id;
  order.approvedAt = new Date();
  await order.save();

  project.requested = subtractMaterials(project.requested || {}, order.materials);
  await project.save();

  return order.populate(POPULATE_ORDER);
};

export const createPurchaseOrder = async (orderId, data, user) => {
  if (user.role !== "accountant") throw new AppError(403, "FORBIDDEN", "Only accountants can place purchase orders");
  const order = await MaterialOrderModel.findOne({ orderId });
  if (!order) throw new AppError(404, "NOT_FOUND", "Material order not found");
  if (order.status !== "approved") throw new AppError(400, "INVALID_STATE", "Order must be approved first");
  const project = await ProjectModel.findById(order.project);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.accountant.toString() !== user.id) throw new AppError(403, "FORBIDDEN", "Not accountant of this project");

  const { vendor, tracking, totalCost } = data;
  if (!vendor || !vendor.name) throw new AppError(422, "MISSING_FIELDS", "vendor.name is required");
  const cost = Number(totalCost);
  if (!Number.isFinite(cost) || cost < 0) throw new AppError(422, "INVALID_COST", "totalCost must be non-negative number");

  validateWithinBudget(project, cost);

  const po = await PurchaseOrderModel.create({
    materialOrder: order._id,
    project: order.project,
    placedBy: user.id,
    materials: order.materials,
    vendor,
    tracking: tracking || {},
    totalCost: cost,
  });

  order.status = "ordered";
  await order.save();

  project.spent = (project.spent || 0) + cost;
  await project.save();

  return po.populate(POPULATE_PO);
};

export const markPurchaseOrderDelivered = async (purchaseOrderId, user) => {
  if (user.role !== "accountant") throw new AppError(403, "FORBIDDEN", "Only accountants can mark delivery");
  const po = await PurchaseOrderModel.findOne({ purchaseOrderId });
  if (!po) throw new AppError(404, "NOT_FOUND", "Purchase order not found");
  if (po.status === "delivered") throw new AppError(400, "ALREADY_DELIVERED", "Already delivered");
  if (po.status === "cancelled") throw new AppError(400, "CANCELLED", "Purchase order is cancelled");
  const project = await ProjectModel.findById(po.project);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.accountant.toString() !== user.id) throw new AppError(403, "FORBIDDEN", "Not accountant of this project");

  po.status = "delivered";
  po.tracking = { ...po.tracking?.toObject?.() || po.tracking || {}, deliveredAt: new Date() };
  await po.save();

  const order = await MaterialOrderModel.findById(po.materialOrder);
  if (order) {
    order.status = "delivered";
    await order.save();
  }

  project.requested = subtractMaterials(project.requested || {}, po.materials);
  project.delivered = sumMaterials(project.delivered || {}, po.materials);
  await project.save();

  return po.populate(POPULATE_PO);
};

export const listPurchaseOrders = async (user) => {
  if (user.role === "owner") {
    return PurchaseOrderModel.find().populate(POPULATE_PO).sort({ createdAt: -1 });
  }
  if (user.role === "accountant") {
    const projects = await ProjectModel.find({ accountant: user.id }).select("_id");
    return PurchaseOrderModel.find({ project: { $in: projects.map((p) => p._id) } })
      .populate(POPULATE_PO).sort({ createdAt: -1 });
  }
  throw new AppError(403, "FORBIDDEN", "Not allowed");
};
