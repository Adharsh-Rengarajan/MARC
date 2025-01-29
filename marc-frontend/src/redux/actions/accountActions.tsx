import axios from "axios";
import { Dispatch } from "redux";
import {
  getOrdersRequest,
  getOrdersSuccess,
  getOrdersFailure,
  getProjectsRequest,
  getProjectsSuccess,
  getProjectsFailure,
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,
} from "../reducer/accountsSlice";

export const getOrders = () => async (dispatch: Dispatch) => {
  dispatch(getOrdersRequest()); 

  try {
    const response = await axios.get("http://localhost:9000/manager/update");
    dispatch(getOrdersSuccess(response.data)); 
  } catch (error) {
    dispatch(
      getOrdersFailure(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    );
  }
};

export const getProjects = () => async (dispatch: Dispatch) => {
  dispatch(getProjectsRequest());

  try {
    const response = await axios.get("http://localhost:9000/projects");
    console.log("Projects Response:", response.data); 

    if (Array.isArray(response.data.data)) {
      dispatch(getProjectsSuccess(response.data.data)); 
    } else {
      dispatch(getProjectsFailure("Received data is not an array"));
    }
  } catch (error) {
    dispatch(
      getProjectsFailure(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    );
  }
};

export const placeOrder = (orderData: any) => async (dispatch: Dispatch) => {
  dispatch(placeOrderRequest()); 

  try {
    const response = await axios.post(
      "http://localhost:9000/place-order",
      orderData
    );
    dispatch(placeOrderSuccess(response.data)); 
    alert("Order placed successfully!");
  } catch (error) {
    dispatch(
      placeOrderFailure(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    );
    alert("Error placing order, please try again");
  }
};

export const getPlacedOrders = () => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get("http://localhost:9000/place-order");
    console.log("Placed Orders Response:", response.data); 
    dispatch(getOrdersSuccess(response.data)); 
  } catch (error) {
    dispatch(
      getOrdersFailure(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    );
  }
};
