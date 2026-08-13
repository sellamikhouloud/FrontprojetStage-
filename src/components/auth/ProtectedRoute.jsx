import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Providers/AuthProvider";
import Spinner from "../Spinner";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { user, ready, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role)
  ) {
    if (user?.role === "coordinator") {
      return <Navigate to="/dashboardCoor" replace />;
    }

    if (
      user?.role === "admin" ||
      user?.role === "chef_coordinator"
    ) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}
