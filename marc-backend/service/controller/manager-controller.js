import * as services from "../services/manager-service.js"
import { setSuccess, setError } from "./response-handler.js";

export const post = async(request, response) => {
    try {
        const task = {...request.body };
        const taskresp = await services.save(task);
        setSuccess(taskresp, response);
    } catch (error) {
        setError(error, response);
    }
}
export const getTasks = async (req, res) => {
    try {
        const tasks = await services.fetchAllTasks();
        setSuccess(tasks, res);
    } catch (error) {
        setError(error, res);
    }
};

export const getProjectsByManager = async (req, res) => {
    try {
      const managerName = req.params.managerName; // Get manager name from request parameters
      console.log(`Fetching projects for manager: ${managerName}`);
      
      // Call the service to fetch projects by manager
      const result = await services.fetchProjectsByManager(managerName);
  
      if (result.length > 0) {
        setSuccess({ projects: result }, res); // Send success response with found projects
      } else {
        setError("No projects found for the given manager", res); // Handle case where no projects match
      }
    } catch (error) {
      console.error("Error in getProjectsByManager:", error.message);  // Log the actual error message
      res.status(500).json({ success: false, message: error.message }); // Send the error response with detailed message
    }
  };

  export const updateDay = async (req, res) => {
    try {
      const { projectName, dayIndex, updatedTasks } = req.body;
  
      // Validate the incoming request data
      if (!projectName || dayIndex === undefined || !updatedTasks) {
        return res.status(400).json({ message: "Invalid request data" });
      }
  
      // Update the tasks for the given day
      const updatedManager = await services.updateDayTasks(projectName, dayIndex, updatedTasks);
  
      return res.status(200).json({
        message: "Day tasks updated successfully",
        updatedManager,
      });
    } catch (error) {
      console.error("Error updating day tasks:", error);
      return res.status(500).json({ message: "Error updating day tasks", error: error.message });
    }
  };
  
  

// Manager Controller
export const updateManager = async(request, response) => {
    try {
        const data = {...request.body };
        const result = await services.saveManager(data);
        setSuccess(result, response);
    } catch (error) {
        setError(error, response);
    }
};

// Engineer Update Controller
export const getEngineerUpdates = async(request, response) => {
    try {
        const updates = await services.fetchAllEngineerUpdates();
        setSuccess(updates, response);
    } catch (error) {
        setError(error, response);
    }
};

// Order Approval Controller
export const approveOrder = async(request, response) => {
    try {
        const approval = {...request.body };
        const result = await services.saveOrderApproval(approval);
        setSuccess(result, response);
    } catch (error) {
        setError(error, response);
    }
};