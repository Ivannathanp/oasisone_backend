import mongoose from "mongoose";

const restaurantSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    password: {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
