import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { SpinnerCustom } from "../loaders/Spinner";
interface ProtectedRouteProps {
  redirectPath?: string;
  children: React.ReactElement;
  code?:string
}

export function ProtectedRoute({
  redirectPath = "/",
  children,
}: ProtectedRouteProps) {
  const { user, fetchMe, loading } = useAuth();

  useEffect(() => {
    fetchMe();
  }, []);

  // ⏳ still checking auth
  if (loading) {
    return <SpinnerCustom />; // or a spinner
  }

  // ❌ not authenticated
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ authenticated
  return children;
}

