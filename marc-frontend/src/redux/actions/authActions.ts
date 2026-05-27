import { api, setToken, clearAuth, extractError, TOKEN_KEY, USER_KEY } from "../../lib/api";
import { AppDispatch } from "../store/store";
import { authRequest, authSuccess, authFailure, authLogout } from "../reducer/authSlice";

export const login = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(authRequest());
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data.data;
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    dispatch(authSuccess({ token, user }));
    return user;
  } catch (error) {
    const msg = extractError(error);
    dispatch(authFailure(msg));
    throw new Error(msg);
  }
};

export const logout = () => (dispatch: AppDispatch) => {
  clearAuth();
  localStorage.removeItem(TOKEN_KEY);
  dispatch(authLogout());
};

export const fetchMe = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get("/auth/me");
    const user = response.data.data;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    const token = localStorage.getItem(TOKEN_KEY) || "";
    dispatch(authSuccess({ user, token }));
    return user;
  } catch (error) {
    dispatch(authFailure(extractError(error)));
  }
};
