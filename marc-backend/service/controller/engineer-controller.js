import * as services from "../services/engineer-service.js"
import { setSuccess, setError } from "./response-handler.js";


//Defining controller for post request
export const post = async(request, response) => {
    try {
        const task = {...request.body };
        const taskresp = await services.save(task);
        setSuccess(taskresp, response);
    } catch (error) {
        setError(error, response);
    }
}

export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { status, flag } = req.body;
  
    try {
      const updatedTask = await services.updateTaskInDb(taskId, status, flag);
      res.status(200).json({
        message: 'Task updated successfully',
        task: updatedTask,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  };
  

//Defining controller for get request
export const get = async(request, response) => {
    try {
        const updates = await services.get();
        setSuccess(updates, response);
    } catch (error) {
        setError(error, response);
    }
};

//Defining the controller for patch request
export const patch = async(request, response) => {
    try {
        const updates = await services.patch();
        setSuccess(updates, response);
    } catch (error) {
        setError(error, response);
    }
};


//Defining the controller for put request
export const put = async(request, response) => {
    try {
        const task = {...request.body };
        const taskresp = await services.saveTask(task);
        setSuccess(taskresp, response);
    } catch (error) {
        setError(error, response);
    }
}