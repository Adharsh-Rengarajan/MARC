import axios from "axios";
import { AppDispatch } from "../store/store";  // Import AppDispatch
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTaskRequest,
  addTaskSuccess,
  addTaskFailure,
    fetchEngineerUpdateRequest,
    fetchEngineerUpdateSuccess,
    fetchEngineerUpdateFailure,
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,
  updateTasksForDayRequest,
  updateTasksForDaySuccess,
  updateTasksForDayFailure,
} from "../reducer/managerTasksSlice";

// Define the API URL
// const API_URL = "http://localhost:9000/managerTasks";

// Action to fetch tasks from the API

interface Order {
  orderId: string;
  ManagerOrderid: string;
  projectId: string;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
  details: string;
}
export const fetchTasks = () => async (dispatch: AppDispatch) => {
  dispatch(fetchTasksRequest()); 

  try {
    const response = await axios.get("http://localhost:9000/managerTasks"); 
    dispatch(fetchTasksSuccess(response.data)); 
  } catch (error: unknown) {  
    if (error instanceof Error) {  
      dispatch(fetchTasksFailure(error.message)); 
    } else {
      dispatch(fetchTasksFailure("An unknown error occurred")); 
    }
  }
};


export const fetchEngineerUpdate = () => async (dispatch: AppDispatch) => {
  dispatch(fetchEngineerUpdateRequest());
  try {
    const response = await axios.get("http://localhost:9000/engineerUpdate");
    dispatch(fetchEngineerUpdateSuccess(response.data));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(fetchEngineerUpdateFailure(error.message));
    } else {
      dispatch(fetchEngineerUpdateFailure("An unknown error occurred"));
    }
  }
};

export const updateTasksForDay = (
  projectName: string,
  dayIndex: number,
  updatedTasks: { title: string; description: string; dueDate: string | null; status: string; flag: boolean }[]
) => async (dispatch: AppDispatch) => {
  dispatch(updateTasksForDayRequest()); // Dispatch request action to show loading state

  try {
    const response = await axios.put(`${API_URL}/updateDay`, {
      projectName,
      dayIndex,
      updatedTasks,
    });
    dispatch(updateTasksForDaySuccess(response.data)); 
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(updateTasksForDayFailure(error.message)); 
    } else {
      dispatch(updateTasksForDayFailure("An unknown error occurred")); 
    }
  }
};



// Action to create a new task via POST request
export const createTask = (payload: { days: { day: string; tasks: { title: string; description: string; dueDate: string | null; status: string; flag: boolean; }[] }[] }) => async (dispatch: AppDispatch) => {
  dispatch(addTaskRequest()); 

  try {
    const response = await axios.post("http://localhost:9000/managerTasks", payload); 
    dispatch(addTaskSuccess(response.data)); 
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(addTaskFailure(error.message)); 
    } else {
      dispatch(addTaskFailure("An unknown error occurred")); 
    }
  }
};

const API_URL = "http://localhost:9000"; // Update with your server URL

// Fetch all projects for a specific manager
export const fetchProjectsByManager = async (managerName: string) => {
  try {
    const response = await axios.get(`${API_URL}/managers/${managerName}/projects`);
    return response.data; // Return the list of projects
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Error fetching projects for the manager");
  }
};

export const placeOrder = (order: Order) => async (dispatch: AppDispatch) => {
  dispatch(placeOrderRequest()); 
  try {
    const response = await axios.post("http://localhost:9000/manager/update", order); 
    dispatch(placeOrderSuccess(response.data)); 
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(placeOrderFailure(error.message)); 
    } else {
      dispatch(placeOrderFailure("An unknown error occurred")); 
    }
  }
};
