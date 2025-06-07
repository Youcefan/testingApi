const mongoose = require("mongoose");
const appError = require("../utils/appError");
const statusText = require("../utils/status");

module.exports = () => (req, res, next) => {
  const id = req.params.productId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(appError.create("معرف غير صالح", 400, statusText.FAIL));
  }
  next();
};