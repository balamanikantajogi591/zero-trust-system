import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!authenticated) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Role not authorized, redirect to their default dashboard
    const redirectPath = userRole === 'ROLE_ADMIN' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
