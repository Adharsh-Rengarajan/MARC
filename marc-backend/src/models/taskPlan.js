import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  dueDate: { type: Date, default: null },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  isImportant: { type: Boolean, default: false },
});

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  label: { type: String, default: "" },
  tasks: { type: [taskSchema], default: [] },
});

const taskPlanSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, unique: true },
    days: { type: [daySchema], default: [] },
  },
  { timestamps: true }
);

export const TaskPlanModel = mongoose.model("TaskPlan", taskPlanSchema);
