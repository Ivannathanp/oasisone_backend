import User from "../../models/userModel.js";
import getRandomString from "randomstring";

// retrieve user
async function RetrieveUser(req, res) {
    try {

      const existingUser = await User.find();
  
        return res.status(200).json({
          status: "SUCCESS",
          message: "Waiter call has been retrieved",
          data: existingUser,
        });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "FAILED",
        message: error.message,
      });
    }
  }

  // Create 
  async function CreateUser(req, res) {
    try {
  
      const {user_name,user_phonenumber,order_id,tenant_id } = req.body;
      let user_id;
      let tempUserId = getRandomString.generate(8);
  
      const existingUserId = await User.findOne({ user_id: "U-" + tempUserId });
  
      if (existingUserId === "U-" + tempUserId) {
        tempUserId = new getRandomString.generate(8);
        return tempUserId;
      }
      user_id = "U-" + tempUserId;

      const newUser = new User({
        user_id: user_id,
        name: user_name,
        phoneNumber: user_phonenumber,
        history: [
          {
            order_id:order_id,
            lastOrder: new Date(),
            tenant_id:tenant_id,
          },
        ],
      });
      await newUser.save();
  
        return res.status(200).json({
          status: "SUCCESS",
          message: "Waiter call has been retrieved",
          data: newUser,
        });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "FAILED",
        message: error.message,
      });
    }
  }

  export {RetrieveUser, CreateUser}