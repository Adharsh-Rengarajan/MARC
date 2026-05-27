import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  role: string;
}
interface Users{
  email:string;
  role:string;
  name:string;
}
interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  users:Users[]|null;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  users:null,
  error: null,
};

const authLoginSlice = createSlice({
  name: "authLogin",
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    fetchLoginDetails(state, action: PayloadAction<Users[]>) {
      state.loading = false;
      state.users = action.payload;
    },
    logout(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess,fetchLoginDetails, loginFailure, logout } = authLoginSlice.actions;

export default authLoginSlice.reducer;
