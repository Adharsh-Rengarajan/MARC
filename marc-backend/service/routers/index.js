import managerRouter from "./manager-router.js";
import contractorRouter from "../routers/contractor-router.js";
import engineerRouter from "./engineer-router.js";
import accountsRouter from "./accounts-router.js";

const initializeRoutes = (app) => {
  engineerRouter(app);
  managerRouter(app);
  contractorRouter(app);
  accountsRouter(app);
  // app.use('/login', contractorRouter);
  // app.use('/managerTasks', managerRouter);
  // app.use('/manager', managerRouter);
  // app.use('/engineerUpdate', engineerRouter);
  // app.use('/orderApproval', managerRouter);
  // app.use('/accountsRouter', accountsRouter);
  // app.use('/Projects', contractorRouter);
  // app.use('/EngineerUpdate', engineerRouter);
  // app.use('/managerTasks', managerRouter);
};

export default initializeRoutes;
