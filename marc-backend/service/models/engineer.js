import mongoose from "mongoose";

//Report-Schema
const EngineerUpdateSchema = new mongoose.Schema({
    // Engineer details
    engineerName: { type: String, required: true }, // Engineer's name
    projectName: { type: String, required: true }, // Project name
    bricks: { type: Number, required: true }, 
    steel: { type: Number, required: true },
    cement: { type: Number, required: true },
    sand: { type: Number, required: true },
    coarseAggregate: { type: Number, required: true },
    fineAggregate: { type: Number, required: true },
  
    // Reports
    reports: [
      {
        date: { type: Date, default: Date.now }, // Date of the report
        description: { type: String, required: true }, // Details about the report
        progress: { type: Number, min: 0, max: 100 }, // Progress percentage
        issues: { type: String }, // Issues/challenges encountered
        resolutions: { type: String }, // Actions taken to resolve issues
      },
    ],
  });
  
  export const EngineerModel = mongoose.model('engineerUpdate', EngineerUpdateSchema);
  

//Task-Schema
const TaskUpdateSchema = new mongoose.Schema({
    tasks: [{ name: { type: String, required: true }, flag: { type: String, required: true } }]
});

export const TaskUpdateModel = mongoose.model('taskUpdate', TaskUpdateSchema);