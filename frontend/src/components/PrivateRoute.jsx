import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();

  return auth.token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
