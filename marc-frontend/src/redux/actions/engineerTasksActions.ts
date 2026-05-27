import axios from "axios";
import { API_BASE_URL } from "../../lib/api";

interface ReportEntry {
  description: string;
  progress: number;
  issues: string;
  resolutions: string;
}

interface EngineerUpdatePayload {
  engineerName: string;
  projectName: string;
  bricks: number;
  steel: number;
  cement: number;
  sand: number;
  coarseAggregate: number;
  fineAggregate: number;
  engineerId?: string;
  projectId?: string;
  reports: ReportEntry[];
}

export const createReport = (reportData: EngineerUpdatePayload) => async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/engineerUpdate`, reportData);
    return response.data;
  } catch (error: unknown) {
    console.log(error);
  }
};
export const updateTaskStatus = (taskId: string, status: string, flag: boolean) => async () => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, { status, flag });
    return response.data;
    // dispatch({
    //   type: 'UPDATE_TASK_STATUS',
    //   payload: response.data, // Update with the returned task data
    // });
  } catch (error: any) {
    // dispatch({
    //   type: 'TASK_UPDATE_ERROR',
    //   payload: error.message,
    // });
    console.log(error);
  }
};
