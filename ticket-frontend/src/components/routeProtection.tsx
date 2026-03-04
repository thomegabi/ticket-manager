import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext"; 
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLogged, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>; 
  }

  if (!isLogged) {
    return (
      <Navigate
        to="/" 
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}