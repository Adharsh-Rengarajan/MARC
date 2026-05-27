import mongoose from "mongoose";
import { EngineerModel, TaskUpdateModel } from "../models/engineer.js";

import { ManagerModel } from "../models/manager.js";

//Saving the tasks
export const save = (model) => {
    const accounts = new EngineerModel(model);
    return accounts.save();
}

export const updateTaskInDb = async (taskId, status, flag) => {
    try {
      const manager = await ManagerModel.findOne({
        'days.tasks._id': taskId,
      });
  
      if (!manager) {
        throw new Error('Manager or task not found');
      }
  
      let taskUpdated = false;
      manager.days.forEach((day) => {
        day.tasks.forEach((task) => {
          if (task._id.toString() === taskId) {
            task.status = status;
            task.flag = flag;
            taskUpdated = true;
          }
        });
      });
  
      if (!taskUpdated) {
        throw new Error('Task not found');
      }
  
      await manager.save();
      return { _id: taskId, status, flag }; // Return updated task data
    } catch (error) {
      throw new Error('Error updating task: ' + error.message);
    }
  };
  
  

//Getting all the tasks
export const get = () => {
    return EngineerModel.find();
}

//Updating the task
export const patch = (tasks) => {
    return TaskUpdateModel.updateMany(tasks);
}

//Saving one task
export const saveTask = (model) => {
    const accounts = new TaskUpdateModel(model);
    return accounts.save();
}