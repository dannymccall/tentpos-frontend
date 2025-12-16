import AuthRoutes from "./AuthRoutes";
import { AuthProvider } from "../../context/AuthContext";
import { NotificationProvider } from "../../context/NotificationContext";
import GuestRoutes from "./GuestRoutes";
import ToastContainer from "../Toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "../error/ErrorBoundary";
import ErrorFallback from "../error/ErrorFallback";
import ScrollToTop from "../ScrollTop";
// import UseSocketContext from "../Layouts/UseSocketContext";
const queryClient = new QueryClient();

export default function Router() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ScrollToTop />
      <NotificationProvider>
        <AuthProvider>
          {/* <UseSocketContext> */}
            <ToastContainer />
            <QueryClientProvider client={queryClient}>
              <AuthRoutes />
            </QueryClientProvider>
            <GuestRoutes />
          {/* </UseSocketContext> */}
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}
