import express from "express";
const router = express.Router();

import { 
    Register
} from '../controllers/Auth/authUser.js';

// Signup
router.post("/signup", Register);

// Get tenant data
// router.get("/tenant/:tenant_id", getTenantData)

export default router;