import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../lib/types";

interface ProjectState {
  loading: boolean;
  list: Project[];
  current: Project | null;
  error: string | null;
}

const initialState: ProjectState = { loading: false, list: [], current: null, error: null };

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    projectsRequest(state) { state.loading = true; state.error = null; },
    projectsSuccess(state, action: PayloadAction<Project[]>) { state.loading = false; state.list = action.payload; },
    projectSuccess(state, action: PayloadAction<Project>) { state.loading = false; state.current = action.payload; },
    projectCreated(state, action: PayloadAction<Project>) {
      state.loading = false;
      state.list = [action.payload, ...state.list];
    },
    projectUpdated(state, action: PayloadAction<Project>) {
      state.loading = false;
      state.list = state.list.map((p) => (p._id === action.payload._id ? action.payload : p));
      if (state.current?._id === action.payload._id) state.current = action.payload;
    },
    projectArchived(state, action: PayloadAction<string>) {
      state.list = state.list.map((p) => (p._id === action.payload ? { ...p, isArchived: true, status: "archived" } : p));
    },
    projectsFailure(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload; },
    clearProjectsError(state) { state.error = null; },
  },
});

export const {
  projectsRequest, projectsSuccess, projectSuccess, projectCreated,
  projectUpdated, projectArchived, projectsFailure, clearProjectsError,
} = projectSlice.actions;
export default projectSlice.reducer;
