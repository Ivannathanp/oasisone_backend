import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    history:[{
      order_id:{
        type: String,
        required: true,
      },
      lastOrder: {
        type: Date,
        required: false,
      },
      tenant_name: {
        type: String,
        required: true,
      }
    }]
    
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.id;
  },
});


const User = mongoose.model("User", userSchema);

export default User;