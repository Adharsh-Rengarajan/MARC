import mongoose from "mongoose";
import { MATERIAL_KEYS } from "./project.js";

const materialsUsedSchema = new mongoose.Schema(
  Object.fromEntries(MATERIAL_KEYS.map((k) => [k, { type: Number, default: 0, min: 0 }])),
  { _id: false }
);

const engineerReportSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true, trim: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    issues: { type: String, default: "" },
    resolutions: { type: String, default: "" },
    materialsUsed: { type: materialsUsedSchema, default: () => ({}) },
  },
  { timestamps: true }
);

engineerReportSchema.index({ project: 1, date: -1 });

export const EngineerReportModel = mongoose.model("EngineerReport", engineerReportSchema);
