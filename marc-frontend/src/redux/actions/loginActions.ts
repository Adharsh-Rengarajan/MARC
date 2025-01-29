import axios from "axios";
import { AppDispatch } from "../store/store";
import { loginRequest, loginSuccess, loginFailure, logout as logoutAction, fetchLoginDetails } from "../reducer/loginSlice";

interface User {
    email: string;
    role: string;
  }
  
export const login = (email: string, password: string, role: string) => async (dispatch: AppDispatch) => {
    dispatch(loginRequest());
  
    try {
      const response = await axios.post("http://localhost:9000/login", {
        email,
        password,
        role,
      });
  
      if (response.data.success) {
        const user: User = {
          email,
          role: response.data.role,
        };
  
        localStorage.setItem("userRole", user.role);
  
        dispatch(loginSuccess(user));
      } else {
        dispatch(loginFailure("Login failed"));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(loginFailure(error.message));
      } else {
        dispatch(loginFailure("An unknown error occurred"));
      }
    }
  };

export const logout = () => (dispatch: AppDispatch) => {
    dispatch(logoutAction());
    localStorage.removeItem("userRole");
};

export const fetchLogin = () => async (dispatch: AppDispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.get("http://localhost:9000/login");
    dispatch(fetchLoginDetails(response.data.data));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(loginFailure(error.message));
    } else {
      dispatch(loginFailure("An unknown error occurred"));
    }
  }
};