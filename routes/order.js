import express from "express";
const router = express.Router();

import { 
    CreateOrder, TenantRetrieveOrder, TenantEditStatus, TenantRejectOrder, TableRetrieveOrder
} from '../controllers/Order/orderdata.js';


// Order
router.post("/create", CreateOrder );

// Retreive
router.get("/retrieve/:tenant_id", TenantRetrieveOrder );

// Table Retreive
router.post("/table/retrieve/:tenant_id", TableRetrieveOrder );

// Edit
router.post("/edit/:tenant_id/:order_id", TenantEditStatus );

// Reject
router.post("/reject/:tenant_id/:order_id", TenantRejectOrder );

export default router;