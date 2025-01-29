import { createBrowserRouter } from "react-router";
import App from "./../App.tsx";
import ManagerComponent from "../pages/manager/ManagerComponent.tsx";
// import EngineerDashboard from "../pages/engineer/component/EngineerDashboard.tsx";
import CreateTasks from "../pages/manager/CreateTasks.tsx";
import ViewTask from "../pages/manager/ViewTask.tsx";
import ReportComponent from "../pages/manager/ReportComponent.tsx";
import Projects from "../pages/manager/Projects.tsx";
import LoginScreen from "../pages/login/LoginScreen.tsx";
import NotFoundComponent from "../pages/NotFoundComponent/NotFoundComponent.tsx";
import OwnerDashboard from "../pages/owner/OwnerDashboard.tsx";
import CreateProject from "../pages/owner/CreateProject.tsx";
import EngineerComponent from "../pages/engineer/component/EngineerComponent.tsx";
import ProjectDetails from "../pages/engineer/component/ProjectDetails.tsx";
import AccountantDashboard from "../pages/account/AccountantDashboard.tsx";
import PurchaseComponent from "../pages/account/PurchaseComponent.tsx";
import OwnerLandingPage from "../pages/owner/OwnerLandingPage.tsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: LoginScreen,
      },
      {
        path: "owner-dashboard",
        Component: OwnerDashboard,
        children: [
          {
            index: true,
            Component: OwnerLandingPage,
          },
          {
            path: "create-project",
            Component: CreateProject,
          },
        ],
      },
      // {
      //   Component: ManagerComponent,
      //   index: true
      // },
      // {
      //   Component: EngineerDashboard,
      //   index: true
      // },
      {
        path: "/managerProjects",
        Component: Projects,
      },
      {
        path: "/managertasks",
        Component: CreateTasks,
      },
      {
        path: "/engineer-dashboard/:email",
        Component: EngineerComponent,
      },
      {
        path: "/project/:projectId",
        Component: ProjectDetails,
      },
      {
        path: "/manager",
        Component: ManagerComponent,
      },
      {
        path: "/view-tasks",
        Component: ViewTask,
      },
      {
        path: "/reports",
        Component: ReportComponent,
      },
      {
        path: "/accountant-dashboard",
        Component: AccountantDashboard,
      },
      {
        path: "/place-order",
        Component: PurchaseComponent,
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundComponent,
  },
]);
