import express from "express";
const router = express.Router();

import { 
    CreateCategories, GetCategory, CreateMenu, EditCategory, EditMenu
} from '../controllers/Menu/menu.js';

// View All Menu (Customer)
router.post("/:tenant_id",  );

// Get Category
router.get("/:tenant_id/category", GetCategory);

// Get Menu
router.get("/:tenant_id/menu",  );

// Add Category
router.post("/:tenant_id/category/create", CreateCategories );

// Add Menu
router.post("/:tenant_id/menu/create", CreateMenu );

// Edit Category
router.post("/:tenant_id/category/edit", EditCategory );

// Edit Menu
router.post("/:tenant_id/menu/edit", EditMenu );

// Delete Category
router.post("/:tenant_id/category/delete",  );

// Delete Menu
router.post("/:tenant_id/menu/delete",  );

export default router;