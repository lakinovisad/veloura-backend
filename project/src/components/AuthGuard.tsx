import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/client";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  if (!getToken()) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}

// HOC version for backward compatibility
export const requireAuth = (Component: React.FC<any>) => (props: any) => {
  if (getToken()) {
    return <Component {...props} />;
  } else {
    window.location.href = "/login";
    return null;
  }
}; 