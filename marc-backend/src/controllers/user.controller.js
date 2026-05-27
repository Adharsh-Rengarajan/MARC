import * as userService from "../services/user.service.js";
import { ok, created, wrap } from "../utils/response.js";

export const list = wrap(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.active === "true") filter.isActive = true;
  if (req.query.active === "false") filter.isActive = false;
  return ok(res, await userService.listUsers(filter));
});

export const get = wrap(async (req, res) => ok(res, await userService.getUserById(req.params.id)));
export const create = wrap(async (req, res) => created(res, await userService.createUser(req.body), "User created"));
export const update = wrap(async (req, res) => ok(res, await userService.updateUser(req.params.id, req.body), "User updated"));
export const remove = wrap(async (req, res) => ok(res, await userService.deleteUser(req.params.id), "User deleted"));
