const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const CategoryController = require("../controllers/categoryController");
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../validations/categoryValidation");
const validateRequest = require("../middleware/validateRequest");

// 🟢 إنشاء تصنيف جديد
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createCategoryValidation,
  validateRequest,
  CategoryController.createCategory
);

// 🟢 تعديل تصنيف
router.patch(
  "/:categoryId",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateCategoryValidation,
  validateRequest,
  CategoryController.updateCategory
);

// 🟢 جلب كل التصنيفات
router.get("/", CategoryController.getAllCategories);

// 🟢 جلب تصنيف واحد
router.get("/:categoryId", CategoryController.getCategory);

router.delete("/:categoryId", CategoryController.deleteCategory); 

module.exports = router;
