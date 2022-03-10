import express from "express";
import getRandomString from "randomstring";
const router = express.Router();

//mongodb admin model
import Restaurant from "../models/tenantModel.js";

//mongodb verification model
import Verification from "../models/verificationModel.js";

//email handler
import nodemailer from "nodemailer";

//unique string
import uuid from "uuidv4";

//env variables
import "dotenv/config";

//password handler
import bcrypt from "bcryptjs";

//path for static verified page
import path from "path";

//nodemailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// Have to turn on less secure apps

//testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready");
    console.log(success);
  }
});

//Signup
router.post("/signup", (req, res) => {
  let { name, email, address, phonenumber, password, confirmPassword } =
    req.body;
  let AdminID;
  let tempId = getRandomString.generate(8);

  const existingId = Restaurant.findOne({ admin_id: "A-" + tempId });
  if (existingId === "A-" + tempId) {
    tempId = new getRandomString.generate(8);
    return tempId;
  }

  AdminID = "A-" + tempId;

  if (
    name == "" ||
    email == "" ||
    address == "" ||
    phonenumber == "" ||
    password == "" ||
    confirmPassword == ""
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
  } else if (
    !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
      phonenumber
    )
  ) {
    res.json({
      status: "FAILED",
      message: " Invalid phone number entered",
    });
  } else if (!/^[a-zA-Z]*$/.test(address)) {
    res.json({
      status: "FAILED",
      message: " Invalid address entered",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: " Password is too short",
    });
  } else if (confirmPassword != password) {
    res.json({
      status: "FAILED",
      message: " Password not match",
    });
  } else {
    //checking if user already exists
    Restaurant.find({ email })
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
              const newRestaurant = new Restaurant({
                admin_id: AdminID,
                name,
                email,
                address,
                phonenumber,
                password: hashedPassword,
                confirmPassword,
                verified: false,
              });

              newRestaurant
                .save()
                .then((result) => {
                  // res.json({
                  //   status: "SUCCESS",
                  //   message: "Signup sucessfull",
                  //   data: result,
                  // });

                  //handle account verification
                  sendVerificationEmail(result, res);
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "An error occured while saving password!",
                  });
                });
            })
            .catch((err) => {
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

// send verification email
const sendVerificationEmail = ({ AdminID, email }, res) => {
  // url to be used in the email
  const currentUrl = "http://localhost:5000/";

  const uniqueString = uuid() + AdminID;

  //mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Oasis One Verification Email",
    html: `<p>Verify your email address to complete the signup process! </p> <p>Click <a href=${
      currentUrl + "admin/verify/" + AdminID + "/" + uniqueString
    }> here </a> to proceed. </p>`,
  };

  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      // set values in verification collection

      const newVerification = new Verification({
        admin_id: AdminID,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              //email sent and verification record saved
              res.json({
                status: "PENDING",
                message: "Verification email sent",
              });
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Verification email failed",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "Couldn't save verification email data!",
          });
        });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occurred while hashing email data!",
      });
    });
};

//Verify email
router.get("/verify/:admin_id/:uniqueString", (req,res) => {
let {admin_id, uniqueString} = req.params;

Verification.find({admin_id}).then((result)=>{
  if (result.length > 0) {
    //user verification record exists

  } else {
    //user verification record doesn't exists
    let message = "Account record doesn't exists or has been verified! Please sign up ot log in.";
res.redirect(`/admin/verified/error=true&message=${message}`);
  }
}).catch((error)=>{
  console.log(error);
let message = "An error occured while checking for existing use verification record";
res.redirect(`/admin/verified/error=true&message=${message}`);
})
});

//Verified page route
router.get("/verified", (req, res) => {
res.sendFile(path.join(__dirname, "./../views/verified.html"));
})

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

    Restaurant.find({ email })
      .then((data) => {
        if (data.length) {
          //User exists
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

export default router;
