import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
interface ProtectedRouteProps {
  redirectPath?: string;
  children: React.ReactElement;
  code?:string
}

export function ProtectedRoute({
  redirectPath = "/",
  children,
}: ProtectedRouteProps) {
  const { user } = useAuth();

  console.log({ user });
  if (user === null) {
    return <Navigate to={redirectPath} replace />;
  }

  // if(code !== "default" || !hasPermission(permissions, code!) && businessProfile?.appRole !== "owner" ){
  //   return <Navigate to="/unauthorized"/>
  // }
  return children;
}
