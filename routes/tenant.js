import express from "express";
const router = express.Router();
import Tenant from "../models/tenantModel.js";

//path for static verified page
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

import { 
  Register, 
  Login, 
  VerifyEmail, 
  PasswordResetMail, 
  ActualResetPassword, 
} from '../controllers/Auth/authTenant.js';

import { 
  GetTenantDetails,
  EditProfile,
  EditTaxCharge, 
  EditServiceCharge, 
  EditOpeningHours
} from '../controllers/Profile/profileTenant.js';

// Signup
router.post("/signup", Register);

// Signin
router.post("/signin", Login);

// Verify email
router.get("/verify/:userID/:uniqueString", VerifyEmail);

// Password reset Email
router.post("/passwordresetrequest", PasswordResetMail);

// Actual reset password
router.post("/passwordreset", ActualResetPassword);

// Change tax and service charges
router.post("/edit/taxcharges", EditTaxCharge);
router.post("/edit/servicecharges", EditServiceCharge);

// Edit Profile
router.post("/edit/:tenant_id", EditProfile);

// Change Opening Hours
router.post("/edit/openinghours/:tenant_id", EditOpeningHours);


router.get("/user/:tenant_id", GetTenantDetails);

export default router;