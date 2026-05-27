import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { Role } from "../lib/types";

interface Props {
  children: ReactNode;
  roles?: Role[];
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const location = useLocation();
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
