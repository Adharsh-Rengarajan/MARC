import { UserModel } from "../models/user.js";
import { ProjectModel } from "../models/project.js";
import { AppError } from "../utils/errors.js";

export const listUsers = async (filter = {}) => {
  const users = await UserModel.find(filter).sort({ createdAt: -1 });
  return users.map((u) => u.toSafeJSON());
};

export const getUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new AppError(404, "NOT_FOUND", "User not found");
  return user.toSafeJSON();
};

export const createUser = async ({ email, password, name, role }) => {
  if (!email || !password || !name || !role) {
    throw new AppError(422, "MISSING_FIELDS", "email, password, name and role are required");
  }
  if (!["owner", "manager", "engineer", "accountant"].includes(role)) {
    throw new AppError(400, "INVALID_ROLE", "Invalid role");
  }
  const exists = await UserModel.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError(409, "DUPLICATE", "Email already registered");
  const user = await UserModel.create({ email, password, name, role });
  return user.toSafeJSON();
};

export const updateUser = async (id, updates) => {
  const allowed = ["name", "role", "isActive", "password"];
  const payload = {};
  for (const k of allowed) if (updates[k] !== undefined) payload[k] = updates[k];
  const user = await UserModel.findById(id);
  if (!user) throw new AppError(404, "NOT_FOUND", "User not found");
  if (payload.isActive === false || payload.role) {
    const projects = await ProjectModel.find({
      $or: [{ manager: id }, { engineer: id }, { accountant: id }],
      isArchived: false,
    }).select("projectName");
    if (projects.length) {
      throw new AppError(
        400,
        "USER_ASSIGNED",
        `Cannot deactivate or change role: user is assigned to ${projects.length} active project(s) (${projects.map((p) => p.projectName).join(", ")}). Reassign first.`
      );
    }
  }
  Object.assign(user, payload);
  await user.save();
  return user.toSafeJSON();
};

export const deleteUser = async (id) => {
  const projects = await ProjectModel.find({
    $or: [{ manager: id }, { engineer: id }, { accountant: id }],
    isArchived: false,
  }).select("projectName");
  if (projects.length) {
    throw new AppError(
      400,
      "USER_ASSIGNED",
      `Cannot delete: user is assigned to ${projects.length} active project(s). Reassign first.`
    );
  }
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) throw new AppError(404, "NOT_FOUND", "User not found");
  return { id };
};
