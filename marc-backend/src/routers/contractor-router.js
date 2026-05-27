import express from "express";
import * as contractorController from "../controller/contractor-controller.js";
const contractorRouter = (app) => {
    const router = express.Router();
    app.use('/', router);
    router.route('/login').post(contractorController.login);
    router.route('/login').get(contractorController.loginDetails);
    // router.route('/login').get(contractorController.getLoginDetails);
    router.route('/projects').post(contractorController.createProject);
    router.route('/projects').get(contractorController.viewProjects);
    router.route('/projects/:projectName').put(contractorController.updateProjectByName);

    // Delete Project (DELETE request)
    router.route('/projects/:projectName').delete(contractorController.deleteProject);
}
export default contractorRouter;
