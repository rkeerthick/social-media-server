import express from "express";
import { getFeedPost, getUserPost, likePosts } from '../controllers/posts.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read

router.get("/", verifyToken, getFeedPost);
router.get("/:id/posts", verifyToken, getUserPost);

// Update

router.patch('/:id/like', verifyToken, likePosts)

export default router;