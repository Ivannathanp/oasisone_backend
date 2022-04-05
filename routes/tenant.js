import express from "express";
const router = express.Router();

// //path for static verified page
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

import { Register, Login, VerifyEmail, PasswordResetMail, ActualResetPassword } from '../controllers/Auth/authTenant.js';
import { EditTaxCharge, EditServiceCharge } from '../controllers/Profile/profileTenant.js';

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

// Charges edit
router.post("/charges/tax", EditTaxCharge);
router.post("/charges/service", EditServiceCharge);

// // Verified page route
// router.get("/verified", (req, res) => {
//   res.sendFile(path.join(__dirname, "./views/verified.html"));
// });

// router.get("/user", (req, res) => {
//   Tenant.find()
//     .then((result) => {
//       res.json(result)
//     })
//   });

export default router;