import express from "express";
import getRandomString from "randomstring";
const router = express.Router();

//mongodb tenant model
import Management from "../models/managementModel.js";

//unique string
import { v4 as uuidv4 } from "uuid";

//env variables
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

router.post("/signup", (req, res) => {
    let { name, email, password } = req.body;
    let ManagementID;
    let tempId = getRandomString.generate(8);
  
    const existingId = Management.findOne({ management_id: "M-" + tempId });
    if (existingId === "M-" + tempId) {
      tempId = new getRandomString.generate(8);
      return tempId;
    }
  
    ManagementID = "M-" + tempId;
  
    if (
      name == "" ||
      email == "" ||
      password == ""
    ) {
      res.json({
        status: "FAILED",
        message: "Empty input fields!",
      });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
      res.json({
        status: "FAILED",
        message: " Invalid name entered",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.json({
        status: "FAILED",
        message: " Invalid email entered",
      });
  
    } else if (password.length < 8) {
      res.json({
        status: "FAILED",
        message: " Password is too short",
      });
    
    } else {
      //checking if user already exists
      Management.find({ email })
        .then((result) => {
          if (result.length) {
            //A user already exists
            res.json({
              status: "FAILED",
              message: "User with the provided email already exists",
            });
          } else {
            //Try to create a new user
  
            //Password handler
            const saltRounds = 10;
            bcrypt
              .hash(password, saltRounds)
              .then((hashedPassword) => {
                const newManagement = new Management({
                  management_id: ManagementID,
                  name,
                  email,
                  password: hashedPassword,
                });
  
                newManagement
                  .save()
                  .then((result) => {
                       res.json({
                    status: "SUCCESS",
                    message: "Signup sucessfull",
                    data: result,
                  });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json({
                      status: "FAILED",
                      message: "An error occured while saving password!",
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  status: "FAILED",
                  message: "An error occured while hashing password!",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: "FAILED",
            message: "An error occured while checking for existing user!",
          });
        });
    }


  });

  router.get("/user", (req, res) => {

    Tenant.find()
      .then((result) => {
        res.json(result)
      })
    });

export default router;
