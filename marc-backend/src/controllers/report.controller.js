import * as reportService from "../services/report.service.js";
import { ok, created, wrap } from "../utils/response.js";

export const list = wrap(async (req, res) => ok(res, await reportService.listReports(req.params.id, req.user)));
export const create = wrap(async (req, res) =>
  created(res, await reportService.createReport(req.params.id, req.body, req.user), "Report submitted")
);
