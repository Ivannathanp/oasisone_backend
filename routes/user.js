import express from "express";
const router = express.Router();

import { 
    Register
} from '../controllers/Auth/authUser.js';

// Signup
router.post("/signup", Register);

//
router.post("/")

export default router;