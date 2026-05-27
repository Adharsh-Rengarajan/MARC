import express from "express";
import * as engineerController from "../controller/engineer-controller.js";

const engineerRouter = (app) => {
  const engineerRouters = express.Router();

  // Mount the routes correctly
  app.use('/', engineerRouters); // Base path is /engineerUpdate

  engineerRouters.route('/engineerUpdate').post(engineerController.post) // Handle POST requests to /engineerUpdate
  engineerRouters.route('/engineerUpdate').get(engineerController.get)
  engineerRouters.route ('/tasks/:taskId').put(engineerController.updateTask); // Handle GET requests to /engineerUpdate
};

export default engineerRouter;
