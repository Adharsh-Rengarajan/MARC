import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "Missing token" });
    }
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(payload.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid user" });
    }
    req.user = { id: user._id.toString(), email: user.email, role: user.role, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
};

export const requireRole = (...allowed) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ code: "FORBIDDEN", message: "Insufficient permissions" });
  }
  next();
};
