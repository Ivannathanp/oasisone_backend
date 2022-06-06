import express from "express";
const router = express.Router();

import { 
    RetrieveUser,CreateUser
} from '../controllers/User/user.js';

// Retrieve
router.get("/retrieve", RetrieveUser);

// Create
router.post("/create", CreateUser);

export default router;