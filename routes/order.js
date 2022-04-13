import express from "express";
const router = express.Router();

import { 
    CreateOrder, TenantRetrieveOrder
} from '../controllers/Order/orderdata.js';


// Order
router.post("/create", CreateOrder );

// Retreive
router.get("/retrieve/:tenant_id", TenantRetrieveOrder );


export default router;