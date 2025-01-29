import { configureStore } from "@reduxjs/toolkit";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import rootReducer from "../../redux/reducer/index"; // Make sure you have a rootReducer

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<RootState, unknown, any>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
