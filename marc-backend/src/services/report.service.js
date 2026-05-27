import mongoose from "mongoose";
import { EngineerReportModel } from "../models/engineerReport.js";
import { ProjectModel } from "../models/project.js";
import { AppError } from "../utils/errors.js";
import { isUserAssigned } from "./project.service.js";
import { sanitizeMaterials, sumMaterials, validateWithinInventory } from "./_materials.js";

export const listReports = async (projectId, user) => {
  if (!mongoose.isValidObjectId(projectId)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (!isUserAssigned(project, user)) throw new AppError(403, "FORBIDDEN", "Not assigned to this project");
  return EngineerReportModel.find({ project: projectId })
    .populate({ path: "engineer", select: "name email" })
    .sort({ date: -1 });
};

export const createReport = async (projectId, data, user) => {
  if (user.role !== "engineer") throw new AppError(403, "FORBIDDEN", "Only engineers can submit reports");
  if (!mongoose.isValidObjectId(projectId)) throw new AppError(400, "INVALID_ID", "Invalid project id");
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new AppError(404, "NOT_FOUND", "Project not found");
  if (project.isArchived) throw new AppError(400, "ARCHIVED", "Project is archived");
  if (!isUserAssigned(project, user)) throw new AppError(403, "FORBIDDEN", "Not assigned to this project");

  const { description, progress, issues, resolutions, materialsUsed, date } = data;
  if (!description) throw new AppError(422, "MISSING_FIELDS", "description is required");
  const sanitized = sanitizeMaterials(materialsUsed || {});

  validateWithinInventory(project, sanitized);

  const report = await EngineerReportModel.create({
    project: projectId,
    engineer: user.id,
    description,
    progress: progress ?? 0,
    issues: issues || "",
    resolutions: resolutions || "",
    materialsUsed: sanitized,
    date: date || new Date(),
  });

  project.consumed = sumMaterials(project.consumed || {}, sanitized);
  await project.save();

  return report;
};
