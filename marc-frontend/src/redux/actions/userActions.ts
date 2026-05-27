import { api, extractError } from "../../lib/api";
import { AppDispatch } from "../store/store";
import {
  usersRequest,
  usersSuccess,
  userCreated,
  userUpdated,
  userDeleted,
  usersFailure,
} from "../reducer/userSlice";

export const fetchUsers = (role?: string) => async (dispatch: AppDispatch) => {
  dispatch(usersRequest());
  try {
    const url = role ? `/users?role=${role}` : "/users";
    const response = await api.get(url);
    dispatch(usersSuccess(response.data.data));
  } catch (error) {
    dispatch(usersFailure(extractError(error)));
  }
};

export const createUser = (payload: Record<string, unknown>) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.post("/users", payload);
    dispatch(userCreated(response.data.data));
    return response.data.data;
  } catch (error) {
    const msg = extractError(error);
    dispatch(usersFailure(msg));
    throw new Error(msg);
  }
};

export const updateUser = (id: string, payload: Record<string, unknown>) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.patch(`/users/${id}`, payload);
    dispatch(userUpdated(response.data.data));
    return response.data.data;
  } catch (error) {
    const msg = extractError(error);
    dispatch(usersFailure(msg));
    throw new Error(msg);
  }
};

export const deleteUser = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await api.delete(`/users/${id}`);
    dispatch(userDeleted(id));
  } catch (error) {
    dispatch(usersFailure(extractError(error)));
  }
};
