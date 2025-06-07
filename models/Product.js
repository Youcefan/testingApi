const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    PrevPrice: {
      type: Number,
      required: false,
    },

    quantity: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    colors: {
      type: Object,
      required: false,
    },
    variable: {
      type: Object,
      required: false,
    },

    description: {
      type: String,
    },
    mainImage: {
      type: String,
      required: true,
    },
    images: [String],

    offers: {
      type: [Object],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: Number,
      default: 0,
    },
    returns: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    Lp:{
      type:[String],
      default:[]
    },
    bestPro:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
