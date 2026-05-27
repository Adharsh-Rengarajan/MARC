import { Project, ManagerOrder, PurchaseOrder } from "../models/accounts.js";

// getting all orders
export const getAllManagerOrders = async () => {
  try {
    // Check if the projectId is a valid ObjectId
    const orders = await ManagerOrder.find();
    return orders; // Return the populated orders
  } catch (error) {
    // If there are errors, throw them
    throw new Error("Error fetching manager orders: " + error.message);
  }
};

//put method used to update order
export const updateOrder = async (ManagerOrderid, orderData) => {
  try {
    // Check if project exists
    const project = await Project.findOne({ projectId: orderData.projectId });
    if (!project) {
      throw new Error("Project not found");
    }

    // Validate order quantities against project
    const isValid = await validateOrderAgainstProject(project, orderData);
    if (!isValid) {
      throw new Error("Order quantities exceed project allocations");
    }

    const updatedOrder = await ManagerOrder.findOneAndUpdate(
      { ManagerOrderid },
      orderData,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    // Fetch updated order with project details
    const orderWithProject = await ManagerOrder.aggregate([
      {
        $match: { ManagerOrderid },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "projectId",
          as: "projectDetails",
        },
      },
      {
        $unwind: "$projectDetails",
      },
    ]);

    return orderWithProject[0];
  } catch (error) {
    throw new Error("Error updating manager order: " + error.message);
  }
};

export const placeOrder = async (orderData) => {
  try {
    const newOrder = new PurchaseOrder(orderData);
    await newOrder.save();
    return newOrder; // Return the created order
  } catch (error) {
    throw new Error("Error placing order: " + error.message);
  }
};

// Service to get all orders
export const getAllOrders = async () => {
  try {
    const orders = await PurchaseOrder.find();
    return orders;
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

const validateOrderAgainstProject = async (project, orderData) => {
  return (
    orderData.bricks <= project.bricks &&
    orderData.steel <= project.steel &&
    orderData.cement <= project.cement &&
    orderData.coarseAggregate <= project.coarseAggregate &&
    orderData.fineAggregate <= project.fineAggregate
  );
};

//get projects from contractor
export const getAllProjects = async () => {
  try {
    const projects = await Project.find({});
    return projects;
  } catch (error) {
    throw new Error("Error fetching projects: " + error.message);
  }
};

//getting project for valdation from contractor
export const getProjectById = async (projectId) => {
  try {
    const project = await Project.findOne({ projectId });
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  } catch (error) {
    throw new Error("Error fetching project: " + error.message);
  }
};
