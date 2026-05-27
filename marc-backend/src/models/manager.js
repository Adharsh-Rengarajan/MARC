import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: false },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    flag: {
        type: Boolean,
        required: true,
    },
});

const ManagerSchema = new mongoose.Schema({
    project:{type: String, required: true},
    engineer:{type: String, required: true},
    days: {
        type: [{
            day: { type: String, required: true }, // e.g., "Day 1"
            tasks: { type: [TaskSchema], required: true }, // Array of tasks for the day
        }],
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

export const ManagerModel = mongoose.model('managerSchemas', ManagerSchema);


// Manager Schema
const ManagerOrders = new mongoose.Schema({
    bricks: { type: Number, required: true },
    steel: { type: Number, required: true },
    cement: { type: Number, required: true },
    sand: { type: Number, required: true },
    coarseAggregate: { type: Number, required: true },
    fineAggregate: { type: Number, required: true },
});

export const ManagerOrdersModel = mongoose.model('managerOrder', ManagerOrders);

// Engineer Update Schema
const EngineerUpdateSchema = new mongoose.Schema({
    task: { name: { type: String, required: true }, flag: { type: Boolean, required: true } },
    labors: { type: Number, required: true },
    materials: { type: Number, required: true },
    equipments: { type: Number, required: true },
});

export const EngineerUpdateModel = mongoose.model('engineerUpdateSchema', EngineerUpdateSchema);

// Order Approval Schema
const OrderApprovalSchema = new mongoose.Schema({
    flag: { type: Boolean, required: true },
});

export const OrderApprovalModel = mongoose.model('orderApprovalSchema', OrderApprovalSchema);


const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, default: null },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    flag: { type: Boolean, default: true }
  });
  
  const taskDaySchema = new mongoose.Schema({
    day: { type: String, required: true },
    tasks: [taskSchema]
  });
  
  export const TaskDay = mongoose.model("TaskDay", taskDaySchema);
  


// export default ManagerModel;