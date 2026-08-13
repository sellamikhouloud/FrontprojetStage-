
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/providers/AuthProvider";
import Spinner from "../Spinner";


export default function ProtectedRoute({ children, allowedRoles }) {

  const { user, ready, isAuthenticated } = useAuth();

  const location = useLocation();

  // Still checking who's logged in → show spinner, don't redirect yet.
  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Spinner />
      </div>
    );
  }

  // Not logged in → send to login page.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Logged in but wrong role → send to their own dashboard.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
