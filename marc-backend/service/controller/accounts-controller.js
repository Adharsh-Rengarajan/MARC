// controllers/managerOrderController.js
import { setSuccess, setError } from "./response-handler.js";
import * as managerOrderService from "../services/accounts-service.js";
//get method
export const getManagerOrders = async (req, res) => {
  try {
    // Fetch all manager orders
    const orders = await managerOrderService.getAllManagerOrders();

    // If no orders found, send a 404 response
    if (!orders.length) {
      return setSuccess(
        {
          code: 404,
          message: "No orders found",
        },
        res
      );
    }

    // Send the orders in the response with a 200 status
    return setSuccess(orders, res);
  } catch (error) {
    // Handle error by sending a failure response
    return setError(error, res);
  }
};
// put method

export const placeOrderController = async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = await managerOrderService.placeOrder(orderData);
    res
      .status(201)
      .json({
        success: true,
        data: newOrder,
        message: "Order placed successfully",
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await managerOrderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateManagerOrder = async (request, response) => {
  try {
    const { ManagerOrderid } = request.params;
    const orderData = request.body;

    if (!orderData.projectId) {
      throw new Error("projectId is required");
    }

    if (
      orderData.ManagerOrderid &&
      orderData.ManagerOrderid !== ManagerOrderid
    ) {
      throw new Error("ManagerOrderid in body does not match URL parameter");
    }

    const updatedOrder = await managerOrderService.updateOrder(
      ManagerOrderid,
      orderData
    );
    setSuccess(updatedOrder, response);
  } catch (error) {
    setError(error, response);
  }
};

//get method
export const getProjects = async (request, response) => {
  try {
    const projects = await projectService.getAllProjects();

    if (!projects.length) {
      return setSuccess(
        {
          code: 404,
          message: "No projects found",
        },
        response
      );
    }

    setSuccess(projects, response);
  } catch (error) {
    setError(error, response);
  }
};
