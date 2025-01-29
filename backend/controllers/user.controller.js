import User from "../models/Users.js";
import {
  getIntrestBasedFriends,
  getMutualFriends,
} from "../utils/recommendation.js";

export const getUserFriends = async (req, res) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    const user = await User.findById(userId).populate("friends", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ friends: user.friends }); // ✅ Corrected
  } catch (error) {
    console.error("Error in getUserFriends controller:", error);

    if (!res.headersSent) {
      return res.status(500).json({ message: "Error getting friends" }); // ✅ Ensures only one response is sent
    }
  }
};

export const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    if (!query)
      return res.status(404).json({ message: "Please input a username" });
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username");

    if (!users) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ users });
  } catch (error) {
    console.log(`Error in SearchUsersController`, error);
    res.status(404).json({ message: "Error searching users" });
  }
};

export const addFriend = async (req, res) => {
  const userId = req.user._id;
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ message: "User not found" });

    if (
      friend.notifications.some(
        (n) => n.type === "friend_request" && n.from.toString() === userId
      )
    ) {
      return res.send(400).json({ message: "Friend request already sent" });
    }

    friend.notifications.push({ type: "friend_request", from: userId });
    await friend.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.log("Error in addFriendController", error);
    res.status(400).json({ message: "error sending friend request " });
  }
};

export const respondFriendRequest = async (req, res) => {
  const userId = req.user._id;
  const { friendId, action } = req.body;

  try {
    if (!friendId)
      return res.status(400).json({ message: "Friend ID is required" });

    if (!["accept", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid action. Must be 'accept' or 'reject'" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ message: "User not found" });

    // Find friend request
    const requestIndex = user.notifications.findIndex(
      (n) => n.type === "friend_request" && n.from.toString() === friendId
    );

    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ message: "No pending friend request from this user" });
    }

    if (action === "accept") {
      // ✅ Add as friends if not already in the list
      if (!user.friends.includes(friendId)) {
        user.friends.push(friendId);
        friend.friends.push(userId);
      }

      // ✅ Notify sender
      friend.notifications.push({
        type: "friend_accept",
        from: userId,
        date: new Date(),
      });
    } else if (action === "reject") {
      // ✅ Notify sender about rejection
      friend.notifications.push({
        type: "friend_reject",
        from: userId,
        date: new Date(),
      });
    }

    // ✅ Remove friend request notification from receiver
    user.notifications.splice(requestIndex, 1);

    await user.save();
    await friend.save();

    res
      .status(200)
      .json({ message: `Friend request ${action}ed successfully.` });
  } catch (error) {
    console.error("Error in respondFriendRequestController:", error);
    res.status(500).json({ message: "Error processing friend request" });
  }
};

export const getFriendRecommendations = async (req, res) => {
  const userId = req.user._id;

  try {
    const mutualFriends = await getMutualFriends(userId);
    const intrestBased = await getIntrestBasedFriends(userId);

    const combined = [...mutualFriends, ...intrestBased].reduce((acc, user) => {
      if (!acc.find((u) => u._id.toString() === user._id.toString()))
        acc.push(user);
      return acc;
    }, []);

    res.status(200).json(combined.slice(0, 10));
  } catch (error) {
    console.error("Error in getFriendRecommendationController", error);
    res.status(400).json({ error: "Error Fetching recommendations." });
  }
};

// Get Notifications
export const getNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId)
      .select("notifications")
      .populate("notifications.from", "username");
    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(400).json({ error: "Error fetching notifications." });
  }
};

// Clear Notifications
export const clearNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    user.notifications = [];
    await user.save();
    res.status(200).json({ message: "Notifications cleared." });
  } catch (error) {
    res.status(500).json({ error: "Error clearing notifications." });
  }
};

export const unfriendUser = async (req, res) => {
  const userId = req.user._id;
  const { friendId } = req.body;

  try {
    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove each other from the friends list
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error in unfriendUser:", error);
    res.status(500).json({ message: "Error removing friend" });
  }
};
