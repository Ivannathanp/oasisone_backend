import express from "express";
import getRandomString from "randomstring";
const router = express.Router();

//mongodb user model
import Restaurant from "../models/restaurantModel.js";

//password handler
import bcrypt from "bcryptjs";

//Signup
router.post("/signup", (req, res) => {
  let { name, email, address, phonenumber, password } = req.body;
  let TenantID;
  let tempId = getRandomString.generate(8);

  const existingId = Restaurant.findOne({ tenant_id: "T-" + tempId });
  if (existingId === "T-" + tempId) {
    tempId = new getRandomString.generate(8);
    return tempId;
  }

  TenantID = "T-" + tempId;

  if (
    name == "" ||
    email == "" ||
    address == "" ||
    phonenumber == "" ||
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
                tenant_id: TenantID,
                name,
                email,
                address,
                phonenumber,
                password: hashedPassword,
              });

              newRestaurant
                .save()
                .then((result) => {
                  res.json({
                    status: "SUCCESS",
                    message: "Signup sucessfull",
                    data: result,
                  });
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


//Signin
router.post("/signin", (req, res) => {
    let { email, password } = req.body;

    if(email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })
    } else {
        //Check if user exist

        Restaurant.find({email}).then(data => {
            if(data.length){
//User exists
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result){
                        //Password match
                        res.json({
                            status: "SUCCESS",
                            message: "Signin successful",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password entered!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing password"
                    })
                })
            } else {
                res.json({
                    status: "FAILED",  
                    message: "Invalid credentials entered!"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }
})

export default router;
