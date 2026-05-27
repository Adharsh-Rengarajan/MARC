import * as projectService from "../services/project.service.js";
import { ok, created, wrap } from "../utils/response.js";

export const list = wrap(async (req, res) => {
  const includeArchived = req.query.archived === "true";
  return ok(res, await projectService.listProjectsForUser(req.user, includeArchived));
});

export const get = wrap(async (req, res) => ok(res, await projectService.getProjectById(req.params.id, req.user)));
export const create = wrap(async (req, res) => created(res, await projectService.createProject(req.body, req.user.id), "Project created"));
export const update = wrap(async (req, res) => ok(res, await projectService.updateProject(req.params.id, req.body), "Project updated"));
export const archive = wrap(async (req, res) => ok(res, await projectService.archiveProject(req.params.id), "Project archived"));
export const unarchive = wrap(async (req, res) => ok(res, await projectService.unarchiveProject(req.params.id), "Project restored"));
