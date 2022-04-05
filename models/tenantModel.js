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
      default: "please input address",
    },
    phoneNumber: {
      type: String,
      default: "please input phone number",
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
    },
    profileColor: {
      type: String,
      default: "#DF3030",
    },
    taxCharge: { 
      type: Number, 
      required: true, 
      default: 10
    },
    serviceCharge: { 
      type: Number, 
      required: true, 
      default: 10
    },
    contract: {
      startingDate: {
        type: Date,
        required : true,
        default: 0,
      },
      duration: {
        type: Number,
        required : true,
        default: 0,
      },
    },
    openingDays: {
      Sunday: { 
        is24Hours : { type: Boolean, default: false },
        isOpen    : { type: Boolean, default: false },
        OpenHour  : { type: String, default: "00" },
        OpenMins  : { type: String, default: "00" },
        OpenTF    : { type: String, default: "AM" },
        CloseHour : { type: String, default: "00" },
        CloseMins : { type: String, default: "00" },
        CloseTF   : { type: String, default: "PM" },
      },
      Monday: { 
        is24Hours : { type: Boolean, default: false },
        isOpen    : { type: Boolean, default: false },
        OpenHour  : { type: String, default: "00" },
        OpenMins  : { type: String, default: "00" },
        OpenTF    : { type: String, default: "AM" },
        CloseHour : { type: String, default: "00" },
        CloseMins : { type: String, default: "00" },
        CloseTF   : { type: String, default: "PM" },
      },
      Tuesday: { 
        is24Hours : { type: Boolean, default: false },
        isOpen    : { type: Boolean, default: false },
        OpenHour  : { type: String, default: "00" },
        OpenMins  : { type: String, default: "00" },
        OpenTF    : { type: String, default: "AM" },
        CloseHour : { type: String, default: "00" },
        CloseMins : { type: String, default: "00" },
        CloseTF   : { type: String, default: "PM" },
      },
      Wednesday: { 
        is24Hours : { type: Boolean, default: false },
        isOpen    : { type: Boolean, default: false },
        OpenHour  : { type: String, default: "00" },
        OpenMins  : { type: String, default: "00" },
        OpenTF    : { type: String, default: "AM" },
        CloseHour : { type: String, default: "00" },
        CloseMins : { type: String, default: "00" },
        CloseTF   : { type: String, default: "PM" },
      },
      Thursday: { 
        is24Hours : { type: Boolean, default: false },
        isOpen    : { type: Boolean, default: false },
        OpenHour  : { type: String, default: "00" },
        OpenMins  : { type: String, default: "00" },
        OpenTF    : { type: String, default: "AM" },
        CloseHour : { type: String, default: "00" },
        CloseMins : { type: String, default: "00" },
        CloseTF   : { type: String, default: "PM" },
      },
      Friday: { 
        is24Hours : { type: Boolean, default: false },
        isOpen    : { type: Boolean, default: false },
        OpenHour  : { type: String, default: "00" },
        OpenMins  : { type: String, default: "00" },
        OpenTF    : { type: String, default: "AM" },
        CloseHour : { type: String, default: "00" },
        CloseMins : { type: String, default: "00" },
        CloseTF   : { type: String, default: "PM" },
      },
      Saturday: { 
        is24Hours : { type: Boolean, default: false },
        isOpen    : { type: Boolean, default: false },
        OpenHour  : { type: String, default: "00" },
        OpenMins  : { type: String, default: "00" },
        OpenTF    : { type: String, default: "AM" },
        CloseHour : { type: String, default: "00" },
        CloseMins : { type: String, default: "00" },
        CloseTF   : { type: String, default: "PM" },
      },
    },
  },
  {
    timestamps: true,
  }
);

tenantSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.id;
    delete ret.password;
  },
});

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
