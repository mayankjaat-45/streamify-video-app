import express from 'express';
import { login, logout, onboarding, signup } from '../controllers/authControllers.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout);
router.post("/onboarding",protectRoute, onboarding);

router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success: true, user: req.user});
})

export default router;
