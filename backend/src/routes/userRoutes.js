import express from "express";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendsReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
const router = express.Router();

//Way to apply mniddleware to every route
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendsReqs)
export default router;
