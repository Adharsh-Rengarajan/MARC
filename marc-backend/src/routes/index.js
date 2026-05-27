import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import projectRoutes from "./project.routes.js";
import taskPlanRoutes from "./taskPlan.routes.js";
import orderRoutes from "./order.routes.js";

export const mountRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/task-plans", taskPlanRoutes);
  app.use("/api/orders", orderRoutes);
};
