import { api, extractError } from "../../lib/api";
import { AppDispatch } from "../store/store";
import {
  projectsRequest, projectsSuccess, projectSuccess, projectCreated,
  projectUpdated, projectArchived, projectsFailure,
} from "../reducer/projectSlice";

export const fetchProjects = (includeArchived = false) => async (dispatch: AppDispatch) => {
  dispatch(projectsRequest());
  try {
    const response = await api.get(`/projects?archived=${includeArchived}`);
    dispatch(projectsSuccess(response.data.data));
  } catch (error) {
    dispatch(projectsFailure(extractError(error)));
  }
};

export const fetchProject = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(projectsRequest());
  try {
    const response = await api.get(`/projects/${id}`);
    dispatch(projectSuccess(response.data.data));
  } catch (error) {
    dispatch(projectsFailure(extractError(error)));
  }
};

export const createProject = (payload: Record<string, unknown>) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.post("/projects", payload);
    dispatch(projectCreated(response.data.data));
    return response.data.data;
  } catch (error) {
    const msg = extractError(error);
    dispatch(projectsFailure(msg));
    throw new Error(msg);
  }
};

export const updateProject = (id: string, payload: Record<string, unknown>) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.patch(`/projects/${id}`, payload);
    dispatch(projectUpdated(response.data.data));
    return response.data.data;
  } catch (error) {
    const msg = extractError(error);
    dispatch(projectsFailure(msg));
    throw new Error(msg);
  }
};

export const archiveProject = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await api.post(`/projects/${id}/archive`);
    dispatch(projectArchived(id));
  } catch (error) {
    dispatch(projectsFailure(extractError(error)));
    throw new Error(extractError(error));
  }
};
