import express from "express";
import * as managerOrderController from "../controller/accounts-controller.js";

const accountsRouter = (app) => {
  const managerOrderRouter = express.Router();
  //manager order route

  app.use("/", managerOrderRouter);
  managerOrderRouter
    .route("/manager/update")
    .get(managerOrderController.getManagerOrders);
  // update manager ticket
  managerOrderRouter
    .route("/place-order")
    .post(managerOrderController.placeOrderController);
  // router.post('/place-order', placeOrderController);

  // GET request to fetch all orders
  // router.get('/orders', getAllOrdersController);
  // verify details from project ticket
  managerOrderRouter
    .route("/place-order")
    .get(managerOrderController.getAllOrdersController);
};
export default accountsRouter;
