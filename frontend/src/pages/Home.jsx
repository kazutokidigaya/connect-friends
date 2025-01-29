import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Friend Recommendation System</h1>
      <p className="mb-8">Connect with like-minded people easily!</p>
      <div className="flex space-x-4">
        <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
