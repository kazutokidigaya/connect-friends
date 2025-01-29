import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notifications from "./Notifications";

const Navbar = () => {
  const { auth, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">Friend Finder</Link>
      </h1>
      {auth.token ? (
        <div className="flex items-center space-x-4">
          <Notifications />
          <span className="font-medium">{auth.user?.username}</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
