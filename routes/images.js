import multer from 'multer';
import express from "express";
const router = express.Router();

import { uploadProfile } from '../middlewares/storage-engine.avatars.js'
import { uploadMenu } from '../middlewares/storage-engine.menu.js';
import { uploadPromo } from '../middlewares/storage-engine.promo.js';
import { uploadContract } from '../middlewares/storage-engine.contract.js';
import { uploadavatar, getavatar, renderavatar } from '../controllers/Images/avatar.js'
import { uploadmenu, getmenu, rendermenu } from '../controllers/Images/menu.js'
import { uploadpromo, getpromo,renderpromo } from '../controllers/Images/promo.js'
import {uploadcontract, getcontract} from '../controllers/Images/contract.js'

router.post('/avatar/:tenantId', uploadProfile, uploadavatar)
router.get ('/avatar/:tenantId', getavatar)
router.get ('/avatar/render/:imageName', renderavatar)

router.post('/menu/:tenantId/:menu_name', uploadMenu, uploadmenu)
router.get ('/menu/:tenantId/:menuId', getmenu)
router.get ('/menu/render/:tenantId/:imageName', rendermenu)

router.post('/promo/:tenantId/:promo_name', uploadPromo, uploadpromo)
router.get ('/promo/:tenantId/:promoId', getpromo)
router.get ('/promo/render/:tenantId/:imageName', renderpromo)

router.post('/contract/:tenantId', uploadContract, uploadcontract)
router.get ('/contract/:tenantId', getcontract)

export default router;