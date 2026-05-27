import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import projectReducer from "./projectSlice";
import userReducer from "./userSlice";
import orderReducer from "./orderSlice";
import taskReducer from "./taskSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectReducer,
  users: userReducer,
  orders: orderReducer,
  tasks: taskReducer,
});

export default rootReducer;
