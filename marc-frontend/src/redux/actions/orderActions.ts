import { api, extractError } from "../../lib/api";
import { AppDispatch } from "../store/store";
import {
  ordersRequest, ordersSuccess, orderCreated, orderUpdated,
  purchaseOrdersSuccess, purchaseOrderCreated, purchaseOrderUpdated, ordersFailure,
} from "../reducer/orderSlice";

export const fetchOrders = () => async (dispatch: AppDispatch) => {
  dispatch(ordersRequest());
  try {
    const response = await api.get("/orders");
    dispatch(ordersSuccess(response.data.data));
  } catch (error) {
    dispatch(ordersFailure(extractError(error)));
  }
};

export const fetchProjectOrders = (projectId: string) => async (dispatch: AppDispatch) => {
  dispatch(ordersRequest());
  try {
    const response = await api.get(`/projects/${projectId}/orders`);
    dispatch(ordersSuccess(response.data.data));
  } catch (error) {
    dispatch(ordersFailure(extractError(error)));
  }
};

export const createOrder = (projectId: string, materials: Record<string, number>) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.post(`/projects/${projectId}/orders`, { materials });
      dispatch(orderCreated(response.data.data));
      return response.data.data;
    } catch (error) {
      const msg = extractError(error);
      dispatch(ordersFailure(msg));
      throw new Error(msg);
    }
  };

export const approveOrder = (orderId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.patch(`/orders/${orderId}/approve`);
    dispatch(orderUpdated(response.data.data));
  } catch (error) {
    dispatch(ordersFailure(extractError(error)));
    throw new Error(extractError(error));
  }
};

export const rejectOrder = (orderId: string, reason: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.patch(`/orders/${orderId}/reject`, { reason });
    dispatch(orderUpdated(response.data.data));
  } catch (error) {
    dispatch(ordersFailure(extractError(error)));
    throw new Error(extractError(error));
  }
};

export const placePurchaseOrder = (orderId: string, payload: Record<string, unknown>) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.post(`/orders/${orderId}/purchase`, payload);
      dispatch(purchaseOrderCreated(response.data.data));
      return response.data.data;
    } catch (error) {
      const msg = extractError(error);
      dispatch(ordersFailure(msg));
      throw new Error(msg);
    }
  };

export const markDelivered = (purchaseOrderId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.post(`/orders/purchase-orders/${purchaseOrderId}/deliver`);
    dispatch(purchaseOrderUpdated(response.data.data));
  } catch (error) {
    dispatch(ordersFailure(extractError(error)));
    throw new Error(extractError(error));
  }
};

export const fetchPurchaseOrders = () => async (dispatch: AppDispatch) => {
  dispatch(ordersRequest());
  try {
    const response = await api.get("/orders/purchase-orders");
    dispatch(purchaseOrdersSuccess(response.data.data));
  } catch (error) {
    dispatch(ordersFailure(extractError(error)));
  }
};
