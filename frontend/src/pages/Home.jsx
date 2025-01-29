import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-between items-center text-gray-100">
      {/* Header Section */}
      <header className="w-full bg-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-6 px-6">
          <h1 className="text-4xl font-extrabold">
            Welcome to <span className="text-blue-400">SocialConnect</span>
          </h1>
          <div>
            <button
              onClick={() => handleNavigation("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-4 transition"
            >
              Login
            </button>
            <button
              onClick={() => handleNavigation("/signup")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col items-center justify-center w-full px-4">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mt-12">
          {/* Card 1 */}
          <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-center transition hover:shadow-2xl hover:bg-gray-700">
            <h3 className="text-3xl font-bold mb-4 text-blue-400">
              Connect with New Friends
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Explore a community of like-minded individuals. Connect and grow
              your social network with ease.
            </p>
            <button
              onClick={() => handleNavigation("/login")}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Start Connecting
            </button>
          </div>

          {/* Card 2 */}

          {/* Card 3 */}
          <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-center transition hover:shadow-2xl hover:bg-gray-700">
            <h3 className="text-3xl font-bold mb-4 text-purple-400">
              Discover New People
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Get recommendations based on your interests. Expand your circle
              today!
            </p>
            <button
              onClick={() => handleNavigation("/signup")}
              className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Explore Recommendations
            </button>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="w-full bg-gray-800 py-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} SocialConnect. Building connections
          that matter.
        </div>
      </footer>
    </div>
  );
}

export default Home;
