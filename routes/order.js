import express from "express";
const router = express.Router();

import { 
    CreateOrder, TenantRetrieveOrder, TenantEditStatus
} from '../controllers/Order/orderdata.js';


// Order
router.post("/create", CreateOrder );

// Retreive
router.get("/retrieve/:tenant_id", TenantRetrieveOrder );

// Edit
router.post("/edit/:order_id", TenantEditStatus );

export default router;