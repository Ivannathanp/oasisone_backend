import mongoose from "mongoose";

const promobannerSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    promotion: [{
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      startingPeriod : {
        type: Date,
        required: true,
      },
      endingPeriod:{
        type: Date,
        required: true,
      },
      details:{
        type: String,
        required: true,
      }
    }],
  },
  {
    timestamps: true,
  }
);

const Promobanner = mongoose.model("Promobanner", promobannerSchema);

export default Promobanner;
