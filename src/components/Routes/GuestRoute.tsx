import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
interface GuestRouteProps {
  children: React.ReactElement;
  redirectPath?: string;
}

export function GuestRoute({
  children,
  redirectPath = "/dashboard",
}: GuestRouteProps) {
  const { user } = useAuth();
  console.log({ user });
  if (user) {
    // Logged in users should NOT access guest routes, redirect them
    return <Navigate to={redirectPath} />;
  }

  return children;
}
