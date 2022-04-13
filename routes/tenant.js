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
  ActualResetPassword 
} from '../controllers/Auth/authTenant.js';

import { EditProfileName, 
  EditProfileColor, 
  EditProfileAddress, 
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

// Change Profile Color
router.post("/edit/profilename", EditProfileName);

// Change Profile Color
router.post("/edit/profilecolor", EditProfileColor);

// Change Profile Address
router.post("/edit/profileaddress", EditProfileAddress);

// Change Opening Hours
router.post("/edit/openinghours", EditOpeningHours);

// // Verified page route
// router.get("/verified", (req, res) => {
//   res.sendFile(path.join(__dirname, "./views/verified.html"));
// });

router.get("/openinghours", EditOpeningHours);

router.get("/user", (req, res) => {
  Tenant.find()
    .then((result) => {
      res.json(result)
    })
  });

export default router;