import mongoose from "mongoose";

const callWaiterSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    waiter: [
      {
        user_name: {
          type: String,
          required: true,
        },
        user_phonenumber: {
          type: String,
          required: true,
        },
        order_instruction: {
          type: String,
          required: false,
        },
        order_table: {
          type: Number,
          required: true,
        },
        user_guest: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CallWaiter = mongoose.model("CallWaiter", callWaiterSchema);

export default CallWaiter;
