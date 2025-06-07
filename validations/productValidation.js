const { body } = require("express-validator");

exports.createProductValidation = [
  body("name").notEmpty().withMessage("اسم المنتج مطلوب"),
  body("price").isNumeric().withMessage("السعر يجب أن يكون رقمًا"),
  body("quantity").notEmpty().withMessage("يجب ملء خانة الكمية"),
];

exports.updateProductValidation = [
  body("name").notEmpty().withMessage("اسم المنتج مطلوب"),
  body("price").isNumeric().withMessage("السعر يجب أن يكون رقمًا"),
  body("quantity").notEmpty().withMessage("يجب ملء خانة الكمية"),
];
