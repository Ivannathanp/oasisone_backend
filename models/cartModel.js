import mongoose from "mongoose";
import { stringify } from "querystring";

const cartSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    user_phoneNumber: {
      type: String,
      required: true,
    },
    user_instruction: {
      type: String,
      required: true,
    },
    user_table: {
      type: String,
      required: true,
    },
    user_count: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    basket: [{
      menu_id: {
        type: String,
        required: true,
      },
      quantity:{
        type: String,
        required: true,
      },
    }]
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
