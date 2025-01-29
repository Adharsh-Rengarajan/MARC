import axios from "axios";
import { AppDispatch } from "../store/store";
import { fetchProjectFailure, fetchProjectRequest, fetchProjectSuccess } from "../reducer/projectSlice";

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
  
export const fetchProjects = () => async (dispatch: AppDispatch) => {
  dispatch(fetchProjectRequest());
  try {
    const response = await axios.get("http://localhost:9000/projects");
    dispatch(fetchProjectSuccess(response.data.data));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(fetchProjectFailure(error.message));
    } else {
      dispatch(fetchProjectFailure("An unknown error occurred"));
    }
  }
};