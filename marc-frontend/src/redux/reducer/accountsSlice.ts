import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key, ReactNode } from 'react';

interface Order {
  _id: Key | null | undefined;
  fineAggregate: any;
  coarseAggregate: any;
  cement: any;
  steel: any;
  bricks: any;
  ManagerOrderid: any;
  orderId: string;
  status: string;
  details: string;
}

interface Project {
  projectValue: ReactNode;
  engineer: ReactNode;
  manager: ReactNode;
  projectName: any;
  _id: string;
  name: string;
  details: string;
  budget: number;
}

interface AccountState {
  orders: Order[];
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  orders: [],
  projects: [],
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // Orders reducers
    getOrdersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getOrdersSuccess(state, action: PayloadAction<Order[]>) {
      state.loading = false;
      state.orders = action.payload;
    },
    getOrdersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Projects reducers
    getProjectsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getProjectsSuccess(state, action: PayloadAction<Project[]>) {
      state.loading = false;
      state.projects = action.payload;
    },
    getProjectsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Place Order reducers
    placeOrderRequest(state) {
      state.loading = true;
      state.error = null;
    },
    placeOrderSuccess(state, action: PayloadAction<Order>) {
      state.loading = false;
      state.orders.push(action.payload); // Add the new order to the state
    },
    placeOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getOrdersRequest,
  getOrdersSuccess,
  getOrdersFailure,
  getProjectsRequest,
  getProjectsSuccess,
  getProjectsFailure,
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,
} = accountSlice.actions;

export default accountSlice.reducer;
