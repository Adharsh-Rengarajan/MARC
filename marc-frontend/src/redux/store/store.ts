import { configureStore } from "@reduxjs/toolkit";
import { ThunkDispatch } from "redux-thunk";
import rootReducer from "../reducer";

export const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, any>;
