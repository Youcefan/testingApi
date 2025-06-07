const asyncWrapper = require("../middleware/asyncWrapper");
const Category = require("../models/Category");
const appError = require("../utils/appError");
const statusText = require("../utils/status");
const fs = require("fs").promises;
const uploadToGitHub = require("../utils/github");
const Product = require('../models/Product');

exports.createCategory = asyncWrapper(async (req, res, next) => {
  const imageFile = req.files["image"][0];
  const imageUrl = await uploadToGitHub({
    filePath: imageFile.path,
    originalName: imageFile.filename,
  });
  await fs.unlink(imageFile.path);

  const image = imageUrl;

  const category = new Category({
    name: req.body.name,
    image,
  });

  await category.save();

  res.status(201).json({
    status: 201,
    statusText: statusText.SUCCESS,
    data: {
      category,
    },
  });
});

exports.getAllCategories = asyncWrapper(async (req, res, next) => {
  const categories = await Category.find({}, { __v: false });

  res.status(200).json({
    status: 200,
    statusText: statusText.SUCCESS,
    message: categories.length === 0 ? "لا توجد نتائج" : undefined,
    data: {
      categories,
    },
  });
});

exports.updateCategory = asyncWrapper(async (req, res, next) => {
  let image;
  if (req.files["image"]?.[0]) {
    const imageUrl = req.files["image"][0];
    image = await uploadToGitHub({
      filePath: imageUrl.path,
      originalName: imageUrl.filename,
    });
    await fs.unlink(imageUrl.path);
  }

  const categoryId = req.params.categoryId;

  // احصل على التصنيف قبل التحديث لحفظ الاسم القديم
  const oldCategory = await Category.findById(categoryId);
  if (!oldCategory) {
    return next(appError.create("التصنيف غير موجود", 404, statusText.FAIL));
  }

  const updatedData = {
    name: req.body.name,
  };
  if (image) updatedData.image = image;

  // حدث التصنيف
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    updatedData,
    { new: true }
  );

  // حدث المنتجات المرتبطة بالاسم القديم
  await Product.updateMany(
    { category: oldCategory.name },
    { category: updatedCategory.name }
  );

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم تعديل التصنيف بنجاح",
    data: { updatedCategory },
  });
});

exports.getCategory = asyncWrapper(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(appError.create("التنصيف غير موجود", 404, statusText.FAIL));
  }
  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم جلب التصنيف بنجاح",
    data: {
      category,
    },
  });
});

exports.deleteCategory = asyncWrapper(async (req, res, next) => {
  const deletedCategory = await Category.findOneAndDelete({
    _id: req.params.categoryId,
  });

  if (!deletedCategory) {
    return next(appError.create("التصنيف غير موجود", 404, statusText.FAIL));
  }

  // تحديث كل المنتجات المرتبطة بالتصنيف
  await Product.updateMany(
    { category: deletedCategory.name  },
    { category: "بدون تصنيف" } 
  );

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم حذف التصنيف وتحديث المنتجات المرتبطة",
    data: {
      deletedCategory,
    },
  });
});
