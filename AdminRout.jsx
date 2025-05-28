import { Navigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useUser from "../../Hooks/useUser"
import Loading from "../../Shared/Loading";

const AdminRoute = ({children}) => {
  const [users , , isLoading] = useUser([]);
  const {user , loading} = useAuth()
  const CurrenUser = users?.find(u => u.email == user?.email);
  const isAdmin = CurrenUser?.admin == 'admin' ;
  console.log(isAdmin);


  if(loading && isLoading){
    <Loading></Loading>
  }

  if(isAdmin){
    return children;
  }

  return <Navigate to={'/'}></Navigate>
}

export default AdminRoute