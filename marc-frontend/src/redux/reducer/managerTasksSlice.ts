import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for tasks, engineer updates, and orders
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: string;
  flag: boolean;
}

interface EngineerUpdate {
  id: string;
  update: string;
}

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

// Define the state interface
interface State {
  tasks: Task[];
  engineerUpdates: EngineerUpdate[];
  orders: Order[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: State = {
  tasks: [],
  engineerUpdates: [],
  orders: [],
  loading: false,
  error: null,
};

// Create the slice
const managerTasksSlice = createSlice({
  name: "managerTasks",
  initialState,
  reducers: {
    // Actions for fetching tasks
    fetchTasksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Actions for adding a task
    addTaskRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addTaskSuccess(state, action: PayloadAction<Task>) {
      state.loading = false;
      state.tasks.push(action.payload);
    },
    addTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Actions for fetching engineer updates
    fetchEngineerUpdateRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchEngineerUpdateSuccess(state, action: PayloadAction<EngineerUpdate[]>) {
      state.loading = false;
      state.engineerUpdates = action.payload;
    },
    fetchEngineerUpdateFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Actions for placing an order
    placeOrderRequest(state) {
      state.loading = true;
      state.error = null;
    },
    placeOrderSuccess(state, action: PayloadAction<Order>) {
      state.loading = false;
      state.orders.push(action.payload);
    },
    placeOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Actions for updating tasks on a specific day
    updateTasksForDayRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateTasksForDaySuccess(state, action: PayloadAction<{ dayIndex: number; updatedTasks: Task[] }>) {
      state.loading = false;
      const { dayIndex, updatedTasks } = action.payload;
      if (state.tasks[dayIndex]) {
        state.tasks[dayIndex].tasks = updatedTasks;
      }
    },
    updateTasksForDayFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions for use in components
export const {
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
} = managerTasksSlice.actions;

// Export the reducer to add it to the store
export default managerTasksSlice.reducer;
