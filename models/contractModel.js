import mongoose from "mongoose";

const contractSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    contract_period: {
      type: String,
      required: true,
    },
    contract_file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model("Contract", contractSchema);

export default Contract;
