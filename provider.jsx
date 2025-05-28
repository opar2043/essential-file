import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const path = location?.pathname;
//   console.log(path);
  if (loading) {
    return <Loading></Loading>;
  }
  if (user) {
    return children;
  }
  return <Navigate to={"/login"} state={path}></Navigate>;
};

export default PrivateRoute;