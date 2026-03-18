import express from 'express';
import { register, login, getAllUsers, deleteUser } from '../controllers/authController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get("/me", verifyToken, (req,res) => {
    res.json({
        message: "Du är inloggad",
        user: req.user
    });
})

router.get('/admin-only', verifyToken, verifyAdmin, (req, res) => {
  res.json({ 
    message: 'Välkommen admin!', 
    user: req.user 
  });
});

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
