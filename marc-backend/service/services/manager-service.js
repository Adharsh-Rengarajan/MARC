// import ManagerModel from "../models/manager.js";
import { ManagerModel, ManagerOrdersModel, EngineerUpdateModel, OrderApprovalModel } from "../models/manager.js";
import {ManagerOrder} from "../models/accounts.js"
import {ProjectModel} from "../models/contractor-model.js"

export const fetchProjectsByManager = async (managerName) => {
  try {
    // Query the ProjectModel to fetch projects where the manager field matches the managerName
    const projects = await ProjectModel.find({ manager: managerName }).exec();
    return projects; // Return the found projects
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    throw new Error('Error fetching projects from the database');
  }
};

export const updateDayTasks = async (projectName, dayIndex, updatedTasks) => { 
  try {
    // Find the manager document by projectName
    const manager = await ManagerModel.findOne({ project: projectName });

    if (!manager) {
      throw new Error("Project not found");
    }

    // Ensure the day exists within the 'days' array
    const day = manager.days.find(d => d.day === dayIndex);

    if (!day) {
      throw new Error("Day not found");
    }

    // Replace the tasks of the day with the updated tasks
    day.tasks = updatedTasks;

    // Save the updated manager document
    await manager.save();

    return manager; // Return the updated manager document
  } catch (error) {
    throw new Error(`Error updating day tasks: ${error.message}`);
  }
};



export const save = (model) => {
    const manager = new ManagerModel(model);
    return manager.save();
}

export const fetchAllTasks = () => {
    return ManagerModel.find();
};

export const saveManager = (model) => {
    const manager = new ManagerOrder(model);
    return manager.save();
};

// Fetch Engineer Updates
export const fetchAllEngineerUpdates = () => {
    return EngineerUpdateModel.find();
};

// Save Order Approval
export const saveOrderApproval = (model) => {
    const orderApproval = new OrderApprovalModel(model);
    return orderApproval.save();
};