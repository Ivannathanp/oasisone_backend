import express from "express";
const router = express.Router();

import { 
    CreatePromotions, RetrievePromotions, EditPromotions, DeletePromotions
} from '../controllers/Promo/promodata.js';

// Create Promotions
router.post("/create/:tenant_id", CreatePromotions );

// Retrieve Promotions
router.get ("/retrieve/:tenant_id", RetrievePromotions );

// Edit Promotions
router.post("/edit/:promo_id", EditPromotions);

// Delete Promotions
router.post("/delete/:promo_id", DeletePromotions)

export default router;