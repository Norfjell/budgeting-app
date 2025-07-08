import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/budget">Budget</Link>
        <Link to="/reports">Reports</Link>
      </div>

      <div className="flex gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}