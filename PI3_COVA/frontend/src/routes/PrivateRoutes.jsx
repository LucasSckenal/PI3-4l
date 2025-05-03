import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;