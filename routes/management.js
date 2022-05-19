import express from "express";
import getRandomString from "randomstring";
const router = express.Router();

//mongodb model
import Management from "../models/managementModel.js";
import Tenant from "../models/tenantModel.js";


import "dotenv/config";

//password handler
import bcrypt from "bcryptjs";

//path for static verified page
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Signin
router.post("/signin", (req, res) => {
  let { email, password } = req.body;

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  } else {
    //Check if user exist

    Management.find({ email })
      .then((data) => {
        if (data.length) {
          //User exists

          //check if user is verified

         
            const hashedPassword = data[0].password;
            bcrypt
              .compare(password, hashedPassword)
              .then((result) => {
                if (result) {
                  //Password match
                  res.json({
                    status: "SUCCESS",
                    message: "Signin successful",
                    data: data,
                  });
                } else {
                  res.json({
                    status: "FAILED",
                    message: "Invalid password entered!",
                  });
                }
              })
              .catch((err) => {
                res.json({
                  status: "FAILED",
                  message: "An error occured while comparing password",
                });
              });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials entered!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occured while checking for existing user",
        });
      });
  }
});

// Get All Tenant Data

  router.get("/user", (req, res) => {

    Tenant.find()
      .then((result) => {
        res.json(result)
      })
    });

    // Search Tenant by Name

    // Filter Tenant by Alphabet (Name)

    // Filter Tenant by Location (Alphabet jalanan)

    // Filter Tenant by Status (open -> close)

    // Tenant Edit Profile (Take from tenant)

    // Tenant Contract File Upload

    // Search Customer by Name

    // Filter Customer by Alphabet (Name)

    // Filter Customer by Location (Last tenant Name)
    
export default router;
