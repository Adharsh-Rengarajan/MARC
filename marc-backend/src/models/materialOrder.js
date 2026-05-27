import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { MATERIAL_KEYS } from "./project.js";

const materialsSchema = new mongoose.Schema(
  Object.fromEntries(MATERIAL_KEYS.map((k) => [k, { type: Number, default: 0, min: 0 }])),
  { _id: false }
);

const materialOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, default: () => uuidv4() },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materials: { type: materialsSchema, required: true },
    estimatedCost: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "ordered", "delivered", "cancelled"],
      default: "requested",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

materialOrderSchema.index({ project: 1, status: 1 });

export const MaterialOrderModel = mongoose.model("MaterialOrder", materialOrderSchema);
