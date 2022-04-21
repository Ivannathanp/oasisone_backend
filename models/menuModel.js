import mongoose from "mongoose";

const menuSchema = mongoose.Schema(
  {
    tenant_id: {
      type: String,
      required: true,
    },
    category: [{
      id: {
        type: String,
        required: true,
      },
      index:  {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      menu: [{
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        isRecommended: {
          type: Boolean,
          required: true,
          default: false
        },
        price: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        isAvailable: {
          type: Boolean,
          required: true,
          default: true,
        },
      }]
    }],
  },
  {
    timestamps: true,
  }
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;