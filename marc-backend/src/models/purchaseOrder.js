import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { MATERIAL_KEYS } from "./project.js";

const materialsSchema = new mongoose.Schema(
  Object.fromEntries(MATERIAL_KEYS.map((k) => [k, { type: Number, default: 0, min: 0 }])),
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    trackingNumber: { type: String, default: "" },
    estimatedDelivery: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    purchaseOrderId: { type: String, unique: true, default: () => uuidv4() },
    materialOrder: { type: mongoose.Schema.Types.ObjectId, ref: "MaterialOrder", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    placedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materials: { type: materialsSchema, required: true },
    vendor: { type: vendorSchema, required: true },
    tracking: { type: trackingSchema, default: () => ({}) },
    totalCost: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["placed", "in-transit", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

export const PurchaseOrderModel = mongoose.model("PurchaseOrder", purchaseOrderSchema);
