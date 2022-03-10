import mongoose from "mongoose";

const tenantSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    profileimage: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
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
      default: "please input address"
    },
    phonenumber: {
      type: String,
      default: "please input phone number"
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;


