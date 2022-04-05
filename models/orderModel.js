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
      type: String,
      required: true,
    },
    order_table: {
      type: String,
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
    order_menu:[{
      menu_id: {
        type: String,
        required: true,
      },
      quantity:{
        type: String,
        required: true,
      },
    }],
    order_total:{
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
