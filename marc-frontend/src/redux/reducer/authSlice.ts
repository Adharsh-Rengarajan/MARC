import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../lib/types";
import { TOKEN_KEY, USER_KEY } from "../../lib/api";

interface AuthState {
  loading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}

const storedUser = localStorage.getItem(USER_KEY);
const storedToken = localStorage.getItem(TOKEN_KEY);

const initialState: AuthState = {
  loading: false,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
    },
    authLogout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { authRequest, authSuccess, authFailure, authLogout } = authSlice.actions;
export default authSlice.reducer;
