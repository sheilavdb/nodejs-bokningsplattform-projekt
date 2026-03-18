import express from 'express';
import { createRoom, getAllRooms, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createRoom);

router.get("/", verifyToken, getAllRooms);

router.put("/:id", verifyToken, verifyAdmin, updateRoom);

router.delete("/:id", verifyToken, verifyAdmin, deleteRoom);

export default router;