import mongoose from "mongoose";

const tenantSchema = mongoose.Schema(
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
      verified: {
        type: Boolean
      }
  },
  {
    timestamps: true,
  }
);

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
