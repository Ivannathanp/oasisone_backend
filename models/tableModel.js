import mongoose from "mongoose";

const tableSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    table: [{
        id: {
          type: String,
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
            default : new Date ("2022-01-01")
        },
        customerCount: {
            type: Number,
            default: 0,
        },
        order_id: {
            type: String, 
            default: 'NULL'
        }
    }]
  },
  {
    timestamps: true,
  }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;