import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider/AuthProvider";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-spinner">Carregando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    const redirectByRole = {
      user: "/",
      doctor: "/doctor/home",
    };
    const fallbackPath = redirectByRole[user.role] || "/";

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RoleRoute;
