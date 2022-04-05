import mongoose from "mongoose";

const tableSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    table: [{
        index:{
            type: Number,
        },
        status: {
            type: String, 
            required: true,
            default: 'EMPTY',
        },
        isWaiterCalled : {
            type: Boolean, 
            required: true,
            default: false,
        },
        timeStart: {
            type: Date,
        },
        customerCount: {
            type: Number,
        },
        order_id: {
            type: String, 
            required: true,
        }
    }]
  },
  {
    timestamps: true,
  }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;