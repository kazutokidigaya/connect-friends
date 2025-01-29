import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addFriend,
  clearNotifications,
  getNotifications,
  getUserFriends,
  respondFriendRequest,
  searchUsers,
  getFriendRecommendations,
  unfriendUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/friends", authMiddleware, getUserFriends);
router.get("/search", authMiddleware, searchUsers);
router.post("/add-friend", authMiddleware, addFriend);
router.post("/respond-friend-request", authMiddleware, respondFriendRequest);
router.get("/recommendations", authMiddleware, getFriendRecommendations);
router.get("/notifications", authMiddleware, getNotifications);
router.post("/clear-notifications", authMiddleware, clearNotifications);
router.post("/unfriend", authMiddleware, unfriendUser); // ✅ Add new Unfriend API

export default router;
