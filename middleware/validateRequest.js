const { validationResult } = require("express-validator");
const statusText = require("../utils/status");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { 
    return res.status(400).json({
      success: statusText.FAIL,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = validateRequest;