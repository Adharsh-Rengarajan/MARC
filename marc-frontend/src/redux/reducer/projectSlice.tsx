import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Project {
    _id: string;
    projectName: string;
    manager: string;
    engineer: string;
    account: string;
    projectValue: number;
    bricks: number;
    steel: number;
    cement: number;
    coarseAggregate: number;
    fineAggregate: number;
    location: string;
  }
interface ProjectState {
    loading: boolean;
  project : Project[] | null;
  error: string | null;
}

const initialState: ProjectState = {
    loading: false,
    error: null,
  project: null
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    fetchProjectRequest(state) {
        state.loading = true;
        state.error = null;
      },
      fetchProjectSuccess(state, action: PayloadAction<Project[]>) {
        state.loading = false;
        state.project = action.payload;
      },
      fetchProjectFailure(state, action: PayloadAction<string>) {
        state.loading = false;
        state.error = action.payload;
      },
  },
});

export const { fetchProjectRequest, fetchProjectSuccess,fetchProjectFailure } = projectSlice.actions;

export default projectSlice.reducer;
