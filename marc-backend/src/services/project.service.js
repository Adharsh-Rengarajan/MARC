import mongoose from "mongoose";
import { ProjectModel } from "../models/project.js";
import { UserModel } from "../models/user.js";
import { AppError } from "../utils/errors.js";
import { sanitizeMaterials, sanitizeUnitCost } from "./_materials.js";

const POPULATE = [
  { path: "manager", select: "name email role isActive" },
  { path: "engineer", select: "name email role isActive" },
  { path: "accountant", select: "name email role isActive" },
  { path: "owner", select: "name email role" },
];

const validateAssignee = async (id, expectedRole) => {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new AppError(422, "MISSING_FIELDS", `Please select a ${expectedRole}`);
  }
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, "INVALID_ID", `Invalid ${expectedRole} id`);
  }
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(404, "NOT_FOUND", `${expectedRole} not found`);
  }
  if (user.role !== expectedRole) {
    throw new AppError(400, "ROLE_MISMATCH", `Assigned user is not a ${expectedRole}`);
  }
  if (!user.isActive) {
    throw new AppError(400, "USER_INACTIVE", `${user.name} is inactive and cannot be assigned`);
  }
};

export const createProject = async (data, ownerId) => {
  const {
    projectName,
    manager, engineer, accountant,
    budget, location,
    allocation, unitCost,
  } = data;
  if (!projectName || !manager || !engineer || !accountant || budget === undefined || !location) {
    throw new AppError(422, "MISSING_FIELDS", "Missing required project fields");
  }
  if (Number(budget) < 0) throw new AppError(422, "INVALID_BUDGET", "Budget must be non-negative");
  await validateAssignee(manager, "manager");
  await validateAssignee(engineer, "engineer");
  await validateAssignee(accountant, "accountant");
  const project = await ProjectModel.create({
    projectName,
    owner: ownerId,
    manager, engineer, accountant,
    budget: Number(budget),
    location,
    allocation: sanitizeMaterials(allocation),
    unitCost: sanitizeUnitCost(unitCost || {}),
  });
  return project.populate(POPULATE);
};

export const listProjectsForUser = async (user, includeArchived = false) => {
  const base = includeArchived ? {} : { isArchived: false };
  let filter = base;
  if (user.role === "owner") filter = base;
  else if (user.role === "manager") filter = { ...base, manager: user.id };
  else if (user.role === "engineer") filter = { ...base, engineer: user.id };
  else if (user.role === "accountant") filter = { ...base, accountant: user.id };
  return ProjectModel.find(filter).populate(POPULATE).sort({ createdAt: -1 });
};

export const getProjectById = async (id, user) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(id).populate(POPULATE);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (!isUserAssigned(project, user)) {
    throw new AppError(403, "FORBIDDEN", "Not assigned to this project");
  }
  return project;
};

export const updateProject = async (id, updates) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(id);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.isArchived) throw new AppError(400, "ARCHIVED", "Cannot edit archived project");

  const allowed = ["projectName", "manager", "engineer", "accountant", "budget", "location", "status", "allocation", "unitCost"];
  const payload = {};
  for (const k of allowed) if (updates[k] !== undefined) payload[k] = updates[k];

  if (payload.manager) await validateAssignee(payload.manager, "manager");
  if (payload.engineer) await validateAssignee(payload.engineer, "engineer");
  if (payload.accountant) await validateAssignee(payload.accountant, "accountant");

  if (payload.budget !== undefined) {
    if (Number(payload.budget) < project.spent) {
      throw new AppError(
        400,
        "BUDGET_TOO_LOW",
        `New budget $${Number(payload.budget).toLocaleString()} is below already-spent $${project.spent.toLocaleString()}`
      );
    }
    payload.budget = Number(payload.budget);
  }

  if (payload.allocation) {
    payload.allocation = sanitizeMaterials(payload.allocation);
    for (const k of Object.keys(payload.allocation)) {
      const inFlight = (project.requested?.[k] || 0) + (project.delivered?.[k] || 0);
      if (payload.allocation[k] < inFlight) {
        throw new AppError(
          400,
          "ALLOCATION_TOO_LOW",
          `New allocation for ${k} (${payload.allocation[k]}) is below already-committed (${inFlight})`
        );
      }
    }
  }

  if (payload.unitCost) payload.unitCost = sanitizeUnitCost(payload.unitCost);

  Object.assign(project, payload);
  await project.save();
  return project.populate(POPULATE);
};

export const archiveProject = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(id);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  project.isArchived = true;
  project.status = "archived";
  await project.save();
  return { id, archived: true };
};

export const unarchiveProject = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(id);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  project.isArchived = false;
  project.status = "active";
  await project.save();
  return project.populate(POPULATE);
};

export const isUserAssigned = (project, user) => {
  if (user.role === "owner") return true;
  const ids = {
    manager: project.manager?._id?.toString() || project.manager?.toString(),
    engineer: project.engineer?._id?.toString() || project.engineer?.toString(),
    accountant: project.accountant?._id?.toString() || project.accountant?.toString(),
  };
  return ids[user.role] === user.id;
};
