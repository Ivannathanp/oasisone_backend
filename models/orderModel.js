import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Cart"
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Cart"
      }
    ],
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    request: {
      type: String,
      required: true,
    },
    table: {
      type: String,
      required: true,
    },
    guess: {
      type: Number,
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
