import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const MATERIAL_KEYS = ["bricks", "steel", "cement", "sand", "coarseAggregate", "fineAggregate"];

const materialsSchema = new mongoose.Schema(
  Object.fromEntries(MATERIAL_KEYS.map((k) => [k, { type: Number, default: 0, min: 0 }])),
  { _id: false }
);

const unitCostSchema = new mongoose.Schema(
  Object.fromEntries(MATERIAL_KEYS.map((k) => [k, { type: Number, default: 0, min: 0 }])),
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, unique: true, default: () => uuidv4() },
    projectName: { type: String, required: true, unique: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accountant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "on-hold", "archived"],
      default: "planning",
    },
    isArchived: { type: Boolean, default: false },
    budget: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    allocation: { type: materialsSchema, default: () => ({}) },
    requested: { type: materialsSchema, default: () => ({}) },
    delivered: { type: materialsSchema, default: () => ({}) },
    consumed: { type: materialsSchema, default: () => ({}) },
    unitCost: { type: unitCostSchema, default: () => ({}) },
  },
  { timestamps: true }
);

projectSchema.index({ manager: 1, isArchived: 1 });
projectSchema.index({ engineer: 1, isArchived: 1 });
projectSchema.index({ accountant: 1, isArchived: 1 });

projectSchema.virtual("remainingBudget").get(function () {
  return Math.max(0, this.budget - this.spent);
});

projectSchema.virtual("availableInventory").get(function () {
  const inv = {};
  for (const k of MATERIAL_KEYS) {
    inv[k] = Math.max(0, (this.delivered?.[k] || 0) - (this.consumed?.[k] || 0));
  }
  return inv;
});

projectSchema.virtual("remainingAllocation").get(function () {
  const rem = {};
  for (const k of MATERIAL_KEYS) {
    rem[k] = Math.max(
      0,
      (this.allocation?.[k] || 0) -
        ((this.requested?.[k] || 0) + (this.delivered?.[k] || 0))
    );
  }
  return rem;
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

export const ProjectModel = mongoose.model("Project", projectSchema);
