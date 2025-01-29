import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/authService";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call API to authenticate user
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      login(data.token, { username: data.username, interests: data.interests });
      navigate("/dashboard");
    } else {
      alert(data.message); // Replace with toast notification
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <div className="w-full flex items-center justify-center p-10 align-middle h-screen">
          <div className="py-6 px-12 text-xl font-medium text-gray-900 bg-white rounded-lg border-2">
            Logging In...
          </div>
        </div>
      ) : (
        <form
          className="bg-white p-8 rounded shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl mb-4">Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-2 border rounded"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
