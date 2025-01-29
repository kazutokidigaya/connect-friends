import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../services/authService";

const FriendRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch friend recommendations from API
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/users/recommendations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setRecommendations(data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch recommendations.");
      }
      setLoading(false);
    };
    fetchRecommendations();
  }, []);

  const sendFriendRequest = async (friendId) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/users/add-friend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Friend request sent!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send friend request.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Friend Recommendations</h3>
      {loading ? (
        <div className="w-full flex items-center justify-center p-10 align-middle h-screen">
          <div className="py-6 px-12 text-xl font-medium text-gray-900 bg-white rounded-lg border-2">
            Loading Recommendations...
          </div>
        </div>
      ) : (
        <ul>
          {recommendations.map((rec) => (
            <li
              key={rec._id}
              className="flex justify-between items-center mb-2"
            >
              <span>{rec.username}</span>
              <button
                onClick={() => sendFriendRequest(rec._id)}
                className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
              >
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRecommendations;
