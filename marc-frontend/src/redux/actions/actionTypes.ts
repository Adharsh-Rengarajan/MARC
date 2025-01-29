// actionTypes.ts
import {ThunkAction} from 'redux-thunk';
import { Action } from 'redux';// Correct import
// Manager Task Actions
export const FETCH_MANAGER_TASKS_REQUEST = 'FETCH_MANAGER_TASKS_REQUEST' as const;
export const FETCH_MANAGER_TASKS_SUCCESS = 'FETCH_MANAGER_TASKS_SUCCESS' as const;
export const FETCH_MANAGER_TASKS_FAILURE = 'FETCH_MANAGER_TASKS_FAILURE' as const;
export const CREATE_MANAGER_TASK = 'CREATE_MANAGER_TASK' as const;

// Login Actions
export const LOGIN_REQUEST = 'LOGIN_REQUEST' as const;
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS' as const;
export const LOGIN_FAILURE = 'LOGIN_FAILURE' as const;

// Engineer Update Actions
export const FETCH_ENGINEER_UPDATE_REQUEST = 'FETCH_ENGINEER_UPDATE_REQUEST' as const;
export const FETCH_ENGINEER_UPDATE_SUCCESS = 'FETCH_ENGINEER_UPDATE_SUCCESS' as const;
export const FETCH_ENGINEER_UPDATE_FAILURE = 'FETCH_ENGINEER_UPDATE_FAILURE' as const;
export const CREATE_ENGINEER_UPDATE = 'CREATE_ENGINEER_UPDATE' as const;

// Order Placement Actions
export const PLACE_ORDER_REQUEST = 'PLACE_ORDER_REQUEST' as const;
export const PLACE_ORDER_SUCCESS = 'PLACE_ORDER_SUCCESS' as const;
export const PLACE_ORDER_FAILURE = 'PLACE_ORDER_FAILURE' as const;

// Thunks (for async actions)
// export type AppThunk = ThunkAction<void, {}, {}, Action>;

// Action Types Union
export type ActionType =
  | typeof FETCH_MANAGER_TASKS_REQUEST
  | typeof FETCH_MANAGER_TASKS_SUCCESS
  | typeof FETCH_MANAGER_TASKS_FAILURE
  | typeof CREATE_MANAGER_TASK
  | typeof LOGIN_REQUEST
  | typeof LOGIN_SUCCESS
  | typeof LOGIN_FAILURE
  | typeof FETCH_ENGINEER_UPDATE_REQUEST
  | typeof FETCH_ENGINEER_UPDATE_SUCCESS
  | typeof FETCH_ENGINEER_UPDATE_FAILURE
  | typeof CREATE_ENGINEER_UPDATE
  | typeof PLACE_ORDER_REQUEST
  | typeof PLACE_ORDER_SUCCESS
  | typeof PLACE_ORDER_FAILURE;
