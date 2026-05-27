import * as authService from "../services/auth.service.js";
import { ok, wrap } from "../utils/response.js";

export const login = wrap(async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password);
  return ok(res, result, "Logged in");
});

export const me = wrap(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  return ok(res, user);
});
