import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Menu" //populate with menu
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", menuSchema);

export default Cart;
