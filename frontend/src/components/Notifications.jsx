import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../services/authService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false); // ✅ Track button state
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setNotifications(data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications.");
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Accept or Reject Friend Request
  const respondToRequest = async (friendId, action) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/users/respond-friend-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId, action }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(`Friend request ${action}ed successfully!`);

        // Remove request from notifications
        setNotifications((prev) => prev.filter((n) => n.from._id !== friendId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to process friend request.");
    }
  };

  const clearNotifications = async () => {
    if (notifications.length === 0) return; // ✅ Prevent API call if already empty

    setIsClearing(true); // ✅ Disable button during API call

    try {
      const response = await fetch(
        `${BASE_URL}/api/users/clear-notifications`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNotifications([]); // ✅ Clear UI notifications
        toast.success("Notifications cleared.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to clear notifications.");
    } finally {
      setIsClearing(false); // ✅ Re-enable button after request
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-72 bg-white shadow-md rounded-md p-4"
        >
          <h3 className="text-lg font-medium">Notifications</h3>
          <ul className="mt-2">
            {notifications.length === 0 ? (
              <li className="text-gray-500">No new notifications</li>
            ) : (
              notifications.map((n, index) => (
                <li key={index} className="border-b py-2">
                  {n.type === "friend_request" && (
                    <div>
                      <p>{n.from.username} sent you a friend request.</p>
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                        onClick={() => respondToRequest(n.from._id, "accept")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => respondToRequest(n.from._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {n.type === "friend_accept" && (
                    <p>{n.from.username} accepted your friend request.</p>
                  )}
                  {n.type === "friend_reject" && (
                    <p>{n.from.username} rejected your friend request.</p>
                  )}
                </li>
              ))
            )}
          </ul>
          <button
            onClick={clearNotifications}
            className={`w-full mt-2 bg-blue-500 text-white py-1 rounded ${
              isClearing || notifications.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isClearing || notifications.length === 0} // ✅ Button is disabled when empty or during API call
          >
            {isClearing ? "Clearing..." : "Clear All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
