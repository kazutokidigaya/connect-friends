import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../services/authService";

const interestsList = [
  "Anime",
  "Travel",
  "Music",
  "Sports",
  "Gaming",
  "Coding",
  "Cooking",
  "Fitness",
  "Art",
  "Movies",
  "Fashion",
  "Tech",
];

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    interests: [],
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call API to register user
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, {
          username: data.username,
          interests: data.interests,
        });
        toast.success("Signup successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error Signing Up");
      console.error("error", error);
    }
    setLoading(false);
  };

  const toggleInterest = (interest) => {
    setForm((prevForm) => {
      const interests = prevForm.interests.includes(interest)
        ? prevForm.interests.filter((i) => i !== interest)
        : [...prevForm.interests, interest];
      return { ...prevForm, interests };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <div className="w-full flex items-center justify-center p-10 align-middle h-screen">
          <div className="py-6 px-12 text-xl font-medium text-gray-900 bg-white rounded-lg border-2">
            Signning Up...
          </div>
        </div>
      ) : (
        <form
          className="bg-white p-8 rounded shadow-md w-96"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl mb-4">Sign Up</h2>
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
          <div className="mb-4">
            <h3 className="mb-2 font-medium">Select Interests (Optional):</h3>
            <div className="grid grid-cols-3 gap-2">
              {interestsList.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  className={`px-2 py-1 border rounded ${
                    form.interests.includes(interest)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded cursor-pointer"
          >
            Sign Up
          </button>
          <p className="pt-4">
            Already registered please{" "}
            <span className="cursor-pointer text-blue-500">
              <Link to="/login">Login.</Link>
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Signup;
