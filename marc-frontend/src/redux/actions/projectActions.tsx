import axios from "axios";
import { AppDispatch } from "../store/store";
import { fetchProjectFailure, fetchProjectRequest, fetchProjectSuccess } from "../reducer/projectSlice";
import { API_BASE_URL } from "../../lib/api";
  
export const fetchProjects = () => async (dispatch: AppDispatch) => {
  dispatch(fetchProjectRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    dispatch(fetchProjectSuccess(response.data.data));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(fetchProjectFailure(error.message));
    } else {
      dispatch(fetchProjectFailure("An unknown error occurred"));
    }
  }
};
