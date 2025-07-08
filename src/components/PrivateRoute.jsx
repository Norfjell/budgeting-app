import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function PrivateRoute({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;

  return user ? children : <Navigate to="/" />;
}