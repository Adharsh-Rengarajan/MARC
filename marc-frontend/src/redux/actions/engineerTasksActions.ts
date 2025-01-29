import axios from "axios";
import { Dispatch } from 'redux';
interface Report {
  engineerName: string;
  engineerId: string;
  projectName: string;
  projectId: string;
  bricks: number;
  steel: number;
  cement: number;
  sand: number;
  coarseAggregate: number;
  fineAggregate: number;
  reports: {
    description: string;
    progress: number;
    issues: string;
    resolutions: string;
  }[];
}


export const createReport = (reportData: Report) => async () => {
  try {
    const response = await axios.post("http://localhost:9000/engineerUpdate", reportData);
    return response.data;
  } catch (error: unknown) {
    console.log(error);
  }
};
export const updateTaskStatus = (taskId: string, status: string, flag: boolean) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.put(`http://localhost:9000/tasks/${taskId}`, { status, flag });
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