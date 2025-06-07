const mongoose = require("mongoose");

const shippingPriceSchema = new mongoose.Schema({
  wilaya: { type: String, required: true }, 
  toHome: { type: Number, required: true , default : 0 }, 
  toOffice: { type: Number, required: true , default : 0 }, 
})

module.exports = mongoose.model("ShippingPrice", shippingPriceSchema);
