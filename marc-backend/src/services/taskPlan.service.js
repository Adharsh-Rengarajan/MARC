import mongoose from "mongoose";
import { TaskPlanModel } from "../models/taskPlan.js";
import { ProjectModel } from "../models/project.js";
import { AppError } from "../utils/errors.js";
import { isUserAssigned } from "./project.service.js";

const requireRoleAndAssignment = async (projectId, user, roles) => {
  if (!mongoose.isValidObjectId(projectId)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.isArchived) throw new AppError(400, "ARCHIVED", "Project is archived");
  if (!roles.includes(user.role)) throw new AppError(403, "FORBIDDEN", "Role not allowed");
  if (!isUserAssigned(project, user)) throw new AppError(403, "FORBIDDEN", "Not assigned to this project");
  return project;
};

export const getTaskPlan = async (projectId, user) => {
  await requireRoleAndAssignment(projectId, user, ["owner", "manager", "engineer"]);
  return TaskPlanModel.findOne({ project: projectId });
};

export const upsertTaskPlan = async (projectId, days, user) => {
  await requireRoleAndAssignment(projectId, user, ["manager"]);
  if (!Array.isArray(days)) throw new AppError(422, "INVALID_PAYLOAD", "days must be an array");
  return TaskPlanModel.findOneAndUpdate(
    { project: projectId },
    { project: projectId, days },
    { new: true, upsert: true, runValidators: true }
  );
};

export const updateTaskInPlan = async (planId, dayNumber, taskId, updates, user) => {
  if (!mongoose.isValidObjectId(planId)) throw new AppError(400, "INVALID_ID", "Invalid plan id");
  const plan = await TaskPlanModel.findById(planId);
  if (!plan) throw new AppError(404, "NOT_FOUND", "Task plan not found");
  const project = await ProjectModel.findById(plan.project);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.isArchived) throw new AppError(400, "ARCHIVED", "Project is archived");
  if (!["engineer", "manager"].includes(user.role)) throw new AppError(403, "FORBIDDEN", "Role not allowed");
  if (!isUserAssigned(project, user)) throw new AppError(403, "FORBIDDEN", "Not assigned to this project");
  const day = plan.days.find((d) => d.dayNumber === Number(dayNumber));
  if (!day) throw new AppError(404, "NOT_FOUND", "Day not found");
  const task = day.tasks.id(taskId);
  if (!task) throw new AppError(404, "NOT_FOUND", "Task not found");
  const fields = ["status", "isImportant", "description", "title", "dueDate"];
  for (const f of fields) if (updates[f] !== undefined) task[f] = updates[f];
  await plan.save();
  return plan;
};
