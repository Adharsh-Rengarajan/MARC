import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginScreen from "../pages/login/LoginScreen";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import EngineerDashboard from "../pages/engineer/EngineerDashboard";
import AccountantDashboard from "../pages/accountant/AccountantDashboard";
import NotFound from "../pages/notFound/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginScreen /> },
  {
    path: "/owner",
    element: (
      <ProtectedRoute roles={["owner"]}>
        <OwnerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute roles={["manager"]}>
        <ManagerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/engineer",
    element: (
      <ProtectedRoute roles={["engineer"]}>
        <EngineerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/accountant",
    element: (
      <ProtectedRoute roles={["accountant"]}>
        <AccountantDashboard />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
]);
