import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:underline ml-4"
    >
      Logout
    </button>
  );
}