import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loggedIn } = useAuth();
  return loggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}