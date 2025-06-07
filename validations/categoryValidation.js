const { body } = require("express-validator");
const Category = require("../models/Category");

exports.createCategoryValidation = [
  body("name")
    .notEmpty().withMessage("اسم التصنيف مطلوب")
    .custom(async (value) => {
      const existing = await Category.findOne({ name: value });
      if (existing) {
        throw new Error("اسم التصنيف مستخدم من قبل");
      }
      return true;
    }),
];

exports.updateCategoryValidation = [
  body("name")
    .notEmpty().withMessage("اسم التصنيف مطلوب")
    .custom(async (value, { req }) => {
      const categoryId = req.params.categoryId;
      const existing = await Category.findOne({
        name: value,
        _id: { $ne: categoryId }, // استثني التصنيف الحالي
      });
      if (existing) {
        throw new Error("اسم التصنيف مستخدم من قبل");
      }
      return true;
    }),
];
