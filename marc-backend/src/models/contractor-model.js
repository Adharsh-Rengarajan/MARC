import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name:{
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["owner", "manager", "engineer", "accountant"],
  },
});

export const UserModel = mongoose.model('User', userSchema);

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
    required: true,
  },
  engineer: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  projectValue: {
    type: Number,
    required: true,
  },
  bricks: {
    type: Number,
    required: true,
  },
  steel: {
    type: Number,
    required: true,
  },
  cement: {
    type: Number,
    required: true,
  },
  coarseAggregate: {
    type: Number,
    required: true,
  },
  fineAggregate: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const ProjectModel = mongoose.model('projectDetails', projectSchema);



