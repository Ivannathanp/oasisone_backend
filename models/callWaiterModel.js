import mongoose from "mongoose";

const callWaiterSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    waiter: [
      {
        name: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        instruction: {
          type: String,
          required: false,
        },
        table: {
          type: String,
          required: true,
        },
		numberOfGuess: {
			type: Number,
			required: true,
		}
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CallWaiter = mongoose.model("CallWaiter", callWaiterSchema);

export default CallWaiter;
