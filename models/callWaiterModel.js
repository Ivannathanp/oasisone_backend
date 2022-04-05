import mongoose from "mongoose";
import { stringify } from "querystring";

const callWaiterSchema = mongoose.Schema(
  {
    order_id: {
      	type: String,
      	required: false,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
				type : String,
				required : true,
		},
		instruction:{
				type: String,
				required: false,
		},
		table: {
				type: String,
				required: true,
		}
  },
  {
    timestamps: true,
  }
);

const CallWaiter = mongoose.model("CallWaiter", callWaiterSchema);

export default CallWaiter;
