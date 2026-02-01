import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(getUserRole())) {
    return <Navigate to="/" />; // Or a dedicated unauthorized page
  }

  return children;
}
