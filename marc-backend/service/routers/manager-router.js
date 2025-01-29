import express from "express"
import * as controllers from "../controller/manager-controller.js" 
// import  updateDay  from "../controller/manager-controller.js";
const managerRouter = (app) =>
{
const managerRouters = express.Router();
app.use('/',managerRouters);
managerRouters.route('/managerTasks').post(controllers.post);
managerRouters.route('/managerTasks').get(controllers.getTasks);
 // Manager Routes
 managerRouters.route('/manager/update').post(controllers.updateManager);

 managerRouters.route('/updateDay').put(controllers.updateDay);
//  managerRouters.route('/managers/:managerName/projects').get(controllers.getProjectsByManager);

managerRouters.route('/managers/:managerName/projects').get(controllers.getProjectsByManager);

// Engineer Update Routes
managerRouters.route('/').get(controllers.getEngineerUpdates);

  // Order Approval Routes
  managerRouters.route("/").post(controllers.approveOrder);
};

export default managerRouter;
