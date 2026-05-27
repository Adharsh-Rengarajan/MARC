import { api, extractError } from "../../lib/api";
import { AppDispatch } from "../store/store";
import {
  tasksRequest,
  planSuccess,
  planUpdated,
  reportsSuccess,
  reportCreated,
  tasksFailure,
} from "../reducer/taskSlice";

export const fetchTaskPlan = (projectId: string) => async (dispatch: AppDispatch) => {
  dispatch(tasksRequest());
  try {
    const response = await api.get(`/projects/${projectId}/task-plan`);
    dispatch(planSuccess(response.data.data));
  } catch (error) {
    dispatch(tasksFailure(extractError(error)));
  }
};

export const saveTaskPlan = (projectId: string, days: unknown[]) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.put(`/projects/${projectId}/task-plan`, { days });
    dispatch(planUpdated(response.data.data));
    return response.data.data;
  } catch (error) {
    const msg = extractError(error);
    dispatch(tasksFailure(msg));
    throw new Error(msg);
  }
};

export const updateTask = (
  planId: string,
  dayNumber: number,
  taskId: string,
  updates: Record<string, unknown>
) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.patch(`/task-plans/${planId}/days/${dayNumber}/tasks/${taskId}`, updates);
    dispatch(planUpdated(response.data.data));
  } catch (error) {
    dispatch(tasksFailure(extractError(error)));
  }
};

export const fetchReports = (projectId: string) => async (dispatch: AppDispatch) => {
  dispatch(tasksRequest());
  try {
    const response = await api.get(`/projects/${projectId}/reports`);
    dispatch(reportsSuccess(response.data.data));
  } catch (error) {
    dispatch(tasksFailure(extractError(error)));
  }
};

export const submitReport = (projectId: string, payload: Record<string, unknown>) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.post(`/projects/${projectId}/reports`, payload);
      dispatch(reportCreated(response.data.data));
      return response.data.data;
    } catch (error) {
      const msg = extractError(error);
      dispatch(tasksFailure(msg));
      throw new Error(msg);
    }
  };
