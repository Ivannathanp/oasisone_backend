import express from "express";
const router = express.Router();

// mongodb models
import Tenant from "../../models/tenantModel.js";
import Verification from "../../models/verificationModel.js";
import PasswordReset from "../../models/passwordresetModel.js";

// email handler
import nodemailer from "nodemailer";

// unique string
import { v4 as uuidv4 } from "uuid";

// env variables
import "dotenv/config";

// password handler
import bcrypt from "bcryptjs";
import getRandomString from "randomstring";

// path for static verified page
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localurl = "http://localhost:4000/";

// nodemailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// Have to turn on less secure apps for verification nodemailer
// testing success
transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Ready");
		console.log(success);
	}
});

// Component
function sendVerificationEmail({ _id, email }, res) {
  // url to be used in the email
  const currentUrl = "http://localhost:5000/";

  const uniqueString = uuidv4() + _id;

  //mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Oasis One Verification Email",
    html: `<p>Verify your email address to complete the signup process! </p> <p>Click <a href=${
      currentUrl + "api/tenant/verify/" + _id + "/" + uniqueString
    }> here </a> to proceed. </p>`,
  };

  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      // set values in verification collection

      const newVerification = new Verification({
        userID: _id,
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

// send password reset email
function sendResetEmail({ _id, email }, redirectUrl, res) {
  const resetString = uuidv4() + _id;

  PasswordReset.deleteMany({ userID: _id })
    .then((result) => {
      //reset records delete successfully
      //mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Password Reset",
        html: `<p>Please use the link below to reset your password!</p> <p>Click <a href=${
          redirectUrl + "/" + _id + "/" + resetString
        }> here </a> to proceed. </p>`,
      };

      //hash the reset string
      const saltRounds = 10;
      bcrypt
        .hash(resetString, saltRounds)
        .then((hashedResetString) => {
          // set values in password reset collection

          const newPasswordReset = new PasswordReset({
            userID: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
          });

          newPasswordReset
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  //reset email sent and password reset record saved
                  res.json({
                    status: "PENDING",
                    message: "Password reset email sent",
                  });
                })
                .catch((error) => {
                  console.log(error);
                  res.json({
                    status: "FAILED",
                    message: "Password reset email failed!",
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Couldn't save password reset data!",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "An error occured while hashing the password reset data!",
          });
        });
    })
    .catch((error) => {
      //error while clearing existing records
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Clearing existing password reset records failed",
      });
    });
}


// Signup Functions
async function Register(req, res) {
	try {
		const { name, email, password, confirmPassword } = req.body;
  	let TenantID;
  	let tempId = getRandomString.generate(8);

		const existingId = Tenant.findOne({ tenant_id: "T-" + tempId });
		if (existingId === "T-" + tempId) {
			tempId = new getRandomString.generate(8);
			return tempId;
		}

  TenantID = "T-" + tempId;

      //Create QrCode link
      const link = "http://localhost:3000/" + TenantID

  if (
    name == "" ||
    email == "" ||
    password == "" ||
    confirmPassword == ""
  ) {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
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
  } else if (confirmPassword != password) {
    res.json({
      status: "FAILED",
      message: "Confirm Password is not the same as password",
    });
  } else {
    //checking if user already exists
    Tenant.find({ email })
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
              const newTenant = new Tenant({
                tenant_id: TenantID,
                name,
                email,
                password: hashedPassword,
                verified: false,
                qrCode: link,
                openingDays: [{
                  day       : "Monday",
                  is24Hours : false,
                  isClosed  : false,
                  OpenHour  : "00",
                  OpenMins  : "00",
                  OpenTF    : "AM",
                  CloseHour : "00",
                  CloseMins : "00",
                  CloseTF   : "PM",
                }, {
                  day       : "Tuesday",
                  is24Hours : false,
                  isClosed  : false,
                  OpenHour  : "00",
                  OpenMins  : "00",
                  OpenTF    : "AM",
                  CloseHour : "00",
                  CloseMins : "00",
                  CloseTF   : "PM",
                }, {
                  day       : "Wednesday",
                  is24Hours : false,
                  isClosed  : false,
                  OpenHour  : "00",
                  OpenMins  : "00",
                  OpenTF    : "AM",
                  CloseHour : "00",
                  CloseMins : "00",
                  CloseTF   : "PM",
                }, {
                  day       : "Thursday",
                  is24Hours : false,
                  isClosed  : false,
                  OpenHour  : "00",
                  OpenMins  : "00",
                  OpenTF    : "AM",
                  CloseHour : "00",
                  CloseMins : "00",
                  CloseTF   : "PM",
                }, {
                  day       : "Friday",
                  is24Hours : false,
                  isClosed  : false,
                  OpenHour  : "00",
                  OpenMins  : "00",
                  OpenTF    : "AM",
                  CloseHour : "00",
                  CloseMins : "00",
                  CloseTF   : "PM",
                }, {
                  day       : "Saturday",
                  is24Hours : false,
                  isClosed  : false,
                  OpenHour  : "00",
                  OpenMins  : "00",
                  OpenTF    : "AM",
                  CloseHour : "00",
                  CloseMins : "00",
                  CloseTF   : "PM",
                }, {
                  day       : "Sunday",
                  is24Hours : false,
                  isClosed  : false,
                  OpenHour  : "00",
                  OpenMins  : "00",
                  OpenTF    : "AM",
                  CloseHour : "00",
                  CloseMins : "00",
                  CloseTF   : "PM",
                } ] 
              });

              newTenant
                .save()
                .then((result) => {
                  //handle account verification
                  sendVerificationEmail(result, res);
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
	} catch (error) {
		console.log(error);
    res.status(500).json({ 
      status  : "FAILED",
      message : error.message 
    });
	}
}

async function Login ( req, res ) {
	try {
		let { email, password } = req.body;

		if (email == "" || password == "") {
			res.json({
				status: "FAILED",
				message: "Empty credentials supplied",
			});
		} else {
			//Check if user exist
	
			Tenant.find({ email })
				.then((data) => {
					if (data.length) {
						//User exists
	
						//check if user is verified
	
						if (!data[0].verified) {
							res.json({
								status: "FAILED",
								message: "Email hasn't been verified yet!",
							});
						} else {
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
						}
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
	} catch (error) {
		console.log(error);
    res.status(500).json({ 
      status  : "FAILED",
      message : error.message 
    });
	}
}

async function VerifyEmail ( req, res ) {
  try {
    let { userID, uniqueString } = req.params;

  Verification.find({ userID })
    .then((result) => {
      if (result.length > 0) {
        //user verification record exists
        const hashedUniqueString = result[0].uniqueString;

        //compare the hashed unique string
        bcrypt
          .compare(uniqueString, hashedUniqueString)
          .then((result) => {
            if (result) {
              //strings match

              Tenant.updateOne({ _id: userID }, { verified: true })
                .then(() => {
                  Verification.deleteOne({ userID })
                    .then(() => {
                      res.redirect( localurl);
                      // res.sendFile(
                      //   path.join(__dirname, "../views/verified.html")
                      // );
                    })
                    .catch((error) => {
                      console.log(error);
                      let message =
                        "An error occured while finalizing verification.";
                      res.redirect(
                        `/api/tenant/verified/error=true&message=${message}`
                      );
                    });
                })
                .catch((error) => {
                  console.log(error);
                  let message =
                    "An error occured while updating tenant record for verification.";
                  res.redirect(
                    `/api/tenant/verified/error=true&message=${message}`
                  );
                });
            } else {
              //existing record but incorrect verification details passed
              let message =
                "Invalid verification details passed. Check your inbox.";
              res.redirect(`/api/tenant/verified/error=true&message=${message}`);
            }
          })
          .catch((error) => {
            let message = "An error occured while comparing unique strings.";
            res.redirect(`/api/tenant/verified/error=true&message=${message}`);
          });
      } else {
        //user verification record doesn't exists
        let message =
          "Account record doesn't exists or has been verified! Please sign up ot log in.";
        res.redirect(`/api/tenant/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        "An error occured while checking for existing use verification record";
      res.redirect(`/api/tenant/verified/error=true&message=${message}`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status  : "FAILED",
      message : error.message 
    });
  }
}

async function PasswordResetMail ( req, res ) {
  try {
    const { email, redirectUrl } = req.body;

    //check if email exists
    Tenant.find({ email })
      .then((data) => {
        if (data.length) {
          //user exists
  
          //check if user is verified
          if (!data[0].verified) {
            res.json({
              status: "FAILED",
              message: "Email hasn't been verified yet!",
            });
          } else {
            //proceed with email to reset password
            sendResetEmail(data[0], redirectUrl, res);
          }
        } else {
          res.json({
            status: "FAILED",
            message: "No account with the supplied email exists!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({
          status: "FAILED",
          message: "An error occured while checking for existing user",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status  : "FAILED",
      message : error.message 
    });
  }
}

async function ActualResetPassword ( req, res ) {
  try {
    let { userID, resetString, newPassword } = req.body;

  PasswordReset.find({ userID })
    .then((result) => {
      if (result.length > 0) {
        //password reset record exist
        //compare hashed reset string
        const hashedResetString = result[0].resetString;
        bcrypt
          .compare(resetString, hashedResetString)
          .then((result) => {
            if (result) {
              //string matched
              //hash password again

              const saltRounds = 10;
              bcrypt
                .hash(newPassword, saltRounds)
                .then((hashedNewPassword) => {
                  //update user password

                  Tenant.updateOne(
                    { _id: userID },
                    { password: hashedNewPassword }
                  )
                    .then(() => {
                      //update complete. Now delete reset password record.

                      PasswordReset.deleteOne({ userID })
                        .then(() => {
                          //both user record and reset record updated
                          res.json({
                            status: "SUCCESS",
                            message: "Password has been reset successfully.",
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                          res.json({
                            status: "FAILED",
                            message:
                              "An error occurred while finalizing password reset.",
                          });
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      res.json({
                        status: "FAILED",
                        message: "Updating user password failed.",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  res.json({
                    status: "FAILED",
                    message: "An error occured while hashing new password.",
                  });
                });
            } else {
              //existing record but incorrect reset string passed
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Invalid password reset details passed.",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.json({
              status: "FAILED",
              message: "Comparing password reset strings failed!",
            });
          });
      } else {
        //password reset record doesn't exist
        res.json({
          status: "FAILED",
          message: "Password reset record does not exist",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Checking for existing password reset failed!",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status  : "FAILED",
      message : error.message 
    });
  }
}

export { Register, Login, VerifyEmail, PasswordResetMail, ActualResetPassword } ;