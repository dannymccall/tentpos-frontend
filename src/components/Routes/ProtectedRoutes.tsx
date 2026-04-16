import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
interface ProtectedRouteProps {
  redirectPath?: string;
  children: React.ReactElement;
  code?:string
}

export function ProtectedRoute({
  redirectPath = "/",
  children,
}: ProtectedRouteProps) {
  const { user, fetchMe } = useAuth();

  useEffect(() => {
    fetchMe()
  }, [])
  // console.log({ user });
  if (user === null) {
    return <Navigate to={redirectPath} replace />;
  }

  // if(code !== "default" || !hasPermission(permissions, code!) && businessProfile?.appRole !== "owner" ){
  //   return <Navigate to="/unauthorized"/>
  // }
  return children;
}
