import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../services/authService";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/users/friends`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFriends(data.friends);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch friends.");
      }
      setLoading(false);
    };
    fetchFriends();
  }, []);

  const unfriend = async (friendId) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/users/unfriend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json();
      if (response.ok) {
        // Remove friend from UI immediately
        setFriends((prevFriends) =>
          prevFriends.filter((f) => f._id !== friendId)
        );
        toast.success("Friend removed.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to remove friend.");
    }
    setLoading(false);
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-4">Your Friends</h3>
      {loading ? (
        <div className="w-full flex items-center justify-center p-10 align-middle h-screen">
          <div className="py-6 px-12 text-xl font-medium text-gray-900 bg-white rounded-lg border-2">
            Fetching Friends...
          </div>
        </div>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="flex justify-between items-center mb-2"
            >
              <span>{friend.username}</span>
              <button
                onClick={() => unfriend(friend._id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendList;
