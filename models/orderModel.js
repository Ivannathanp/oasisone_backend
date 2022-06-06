import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    order_status: {
      type: Number,
      required: true,
    },
    order_table: {
      type: Number,
      required: true,
    },
    order_time:{
      type: String,
      required: true,
    },
    tenant_id:{
      type: String,
      required: true,
    },
    order_menu:[{ type: {}, required: false }],
    order_item:{
      type: Number,
      required: true,
    },
    order_total:{
      type: Number,
      required: true,
    },
    order_servicecharge:{
      type: Number,
      required: true,
    },
    order_taxcharge:{
      type: Number,
      required: true,
    },
    user_name:{
      type: String,
      required: true,
    },
    user_phonenumber:{
      type: String,
      required: true,
    },
    order_instruction: {
      type: String,
      required: false,
      default: '',
    },
    user_guest:{
      type: Number,
      required: true,
    },
    reject_reason:{
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
