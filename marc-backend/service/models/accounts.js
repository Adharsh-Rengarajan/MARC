import mongoose from "mongoose";
//Vendordetails - this will be added to the ticket

const vendorDetailsSchema = new mongoose.Schema({
  name: String,
  contact: String,
  address: String,
});

const trackingDetailsSchema = new mongoose.Schema({
  trackingNumber: String,
  estimatedDelivery: Date,
});

// Manager Order schema
const managerOrderSchema = new mongoose.Schema(
  {
    ManagerOrderid: { type: String, required: true, unique: true },
    project:{type: String, required: true},
    bricks: { type: Number, default: 0 },
    steel: { type: Number, default: 0 },
    cement: { type: Number, default: 0 },
    coarseAggregate: { type: Number, default: 0 },
    fineAggregate: { type: Number, default: 0 },
    vendorDetails: vendorDetailsSchema,
    trackingDetails: trackingDetailsSchema,
  },
  { timestamps: true }
);

export const ManagerOrder = mongoose.model("ManagerOrder", managerOrderSchema);

//project details from contractor
const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  projectName: { type: String, required: true },
  projectValue: { type: Number, required: true },
  bricks: { type: Number, required: true },
  steel: { type: Number, required: true },
  cement: { type: Number, required: true },
  coarseAggregate: { type: Number, required: true },
  fineAggregate: { type: Number, required: true },
});

export const Project = mongoose.model("Project", projectSchema);

const orderSchema = new mongoose.Schema(
  {
    ManagerOrderid: { type: String, required: true, unique: true },
    bricks: { type: Number, required: true },
    steel: { type: Number, required: true },
    cement: { type: Number, required: true },
    coarseAggregate: { type: Number, required: true },
    fineAggregate: { type: Number, required: true },
    projectName: { type: String, required: true },  // Add projectName
  },
  { timestamps: true }
);

export const PurchaseOrder = mongoose.model('placeOrder', orderSchema);


