import { Route, Routes } from "react-router-dom";
import { GuestRoute } from "./GuestRoute";
import AuthCallback from "../ui/auth/AuthCallback";
import Auth from "../ui/auth/Auth";

const GuestRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestRoute>
            <Auth />
          </GuestRoute>
        }
      />

      <Route
        path="/auth/callback"
        element={
          <GuestRoute>
            <AuthCallback />
          </GuestRoute>
        }
      />
    </Routes>
  );
};

export default GuestRoutes;
