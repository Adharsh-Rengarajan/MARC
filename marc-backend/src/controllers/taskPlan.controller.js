import * as taskPlanService from "../services/taskPlan.service.js";
import { ok, wrap } from "../utils/response.js";

export const get = wrap(async (req, res) => ok(res, await taskPlanService.getTaskPlan(req.params.id, req.user)));
export const upsert = wrap(async (req, res) =>
  ok(res, await taskPlanService.upsertTaskPlan(req.params.id, req.body.days, req.user), "Task plan saved")
);
export const updateTask = wrap(async (req, res) => {
  const { planId, dayNumber, taskId } = req.params;
  const plan = await taskPlanService.updateTaskInPlan(planId, dayNumber, taskId, req.body, req.user);
  return ok(res, plan, "Task updated");
});
