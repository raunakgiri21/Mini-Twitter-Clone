import express from "express";
import { deleteUser, getUser, updateUser, followUser, unfollowUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/find/:id",getUser);
router.put("/:id",verifyToken,updateUser)
router.delete("/:id",verifyToken,deleteUser)

router.put("/follow/:id",verifyToken,followUser)
router.put("/unfollow/:id",verifyToken,unfollowUser)

export default router;
