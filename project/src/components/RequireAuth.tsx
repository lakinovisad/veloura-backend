import { getToken } from "../services/client";

export const requireAuth = (Component: React.FC<any>) => (props: any) => {
  if (getToken()) {
    return <Component {...props} />;
  } else {
    window.location.href = "/login";
    return null;
  }
}; 