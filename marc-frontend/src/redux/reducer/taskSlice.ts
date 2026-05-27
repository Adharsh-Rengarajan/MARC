import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskPlan, EngineerReport } from "../../lib/types";

interface TaskState {
  loading: boolean;
  plan: TaskPlan | null;
  reports: EngineerReport[];
  error: string | null;
}

const initialState: TaskState = { loading: false, plan: null, reports: [], error: null };

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    tasksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    planSuccess(state, action: PayloadAction<TaskPlan | null>) {
      state.loading = false;
      state.plan = action.payload;
    },
    planUpdated(state, action: PayloadAction<TaskPlan>) {
      state.loading = false;
      state.plan = action.payload;
    },
    reportsSuccess(state, action: PayloadAction<EngineerReport[]>) {
      state.loading = false;
      state.reports = action.payload;
    },
    reportCreated(state, action: PayloadAction<EngineerReport>) {
      state.reports = [action.payload, ...state.reports];
    },
    tasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  tasksRequest,
  planSuccess,
  planUpdated,
  reportsSuccess,
  reportCreated,
  tasksFailure,
} = taskSlice.actions;
export default taskSlice.reducer;
