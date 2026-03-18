import express from 'express';
import { createBooking, getAllBookings, getMyBookings, updateBooking, deleteBooking } from '../controllers/bookingController.js'
import { verifyToken, verifyAdmin } from '../middleware/auth.js'

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getAllBookings);

router.get("/my-bookings", verifyToken, getMyBookings);

router.post("/", verifyToken, createBooking);

router.put("/:id", verifyToken, updateBooking);

router.delete("/:id", verifyToken, deleteBooking);

export default router;