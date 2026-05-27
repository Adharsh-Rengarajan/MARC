import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../lib/types";

interface UserState {
  loading: boolean;
  list: User[];
  error: string | null;
}

const initialState: UserState = { loading: false, list: [], error: null };

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    usersSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false;
      state.list = action.payload;
    },
    userCreated(state, action: PayloadAction<User>) {
      state.list = [action.payload, ...state.list];
    },
    userUpdated(state, action: PayloadAction<User>) {
      state.list = state.list.map((u) => (u.id === action.payload.id ? action.payload : u));
    },
    userDeleted(state, action: PayloadAction<string>) {
      state.list = state.list.filter((u) => u.id !== action.payload);
    },
    usersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  usersRequest,
  usersSuccess,
  userCreated,
  userUpdated,
  userDeleted,
  usersFailure,
} = userSlice.actions;
export default userSlice.reducer;
