const asyncWrapper = require("../middleware/asyncWrapper");
const Product = require("../models/Product");
const appError = require("../utils/appError");
const statusText = require("../utils/status");
const fs = require("fs").promises;
const uploadToGitHub = require("../utils/github");

exports.createProduct = asyncWrapper(async (req, res, next) => {
  const images = [];
  let variable, colors;
  // رفع الصور الإضافية
  for (const file of req.files["images"]) {
    const url = await uploadToGitHub({
      filePath: file.path,
      originalName: file.filename,
    });
    await fs.unlink(file.path); // حذف الملف المحلي بعد الرفع الناجح
    images.push(url);
  }
  
  const mainImageFile = req.files["mainImage"][0];
  const mainImageUrl = await uploadToGitHub({
    filePath: mainImageFile.path,
    originalName: mainImageFile.filename,
  });
  await fs.unlink(mainImageFile.path);

  const mainImage = mainImageUrl;

  variable = JSON.parse(req.body.variable);
  colors = JSON.parse(req.body.colors);

  // إنشاء المنتج
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    PrevPrice: req.body.PrevPrice || null,
    quantity: req.body.quantity,
    category: req.body.category,
    description: req.body.description,
    family: req.body.family,
    variable,
    colors,
    images,
    mainImage,
  });

  await product.save();

  res.status(201).json({
    status: 201,
    statusText: statusText.SUCCESS,
    data: {
      product,
    },
  });
});

exports.getAllProducts = asyncWrapper(async (req, res, next) => {
  // ----------- الاستعلام من قاعدة البيانات -----------
  const products = await Product.find({}, { __v: false }); // جلب جميع المنتجات بدون فلاتر

  res.status(200).json({
    status: 200,
    statusText: statusText.SUCCESS,
    message: products.length === 0 ? "لا توجد نتائج" : undefined,
    data: {
      products,
    },
  });
});

exports.getminAllProducts = asyncWrapper(async (req, res, next) => {
  const products = await Product.find(
    {},
    {
      _id: 1,
      name: 1,
      mainImage: 1,
      price: 1,
      PrevPrice: 1,
      isPublished: 1,
      bestPro: 1,
      offers: 1,
      category: 1,
      createdAt:1
    }
  );
  res.status(200).json({
    status: 200,
    statusText: statusText.SUCCESS,
    message: products.length === 0 ? "لا توجد نتائج" : undefined,
    data: {
      products,
    },
  });
});

exports.getProduct = asyncWrapper(async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError.create("المنتج غير موجود", 404, statusText.FAIL));
  }
  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم جلب المنتح بنجاح",
    data: {
      product,
    },
  });
});

exports.updateProduct = asyncWrapper(async (req, res, next) => {
  let newImages = [];
  let mainImage;

  // رفع الصور الجديدة إن وُجدت
  if (req.files["newImages"]?.length > 0) {
    for (const file of req.files["newImages"]) {
      try {
        const imageUrl = await uploadToGitHub({
          filePath: file.path,
          originalName: file.filename,
        });
        newImages.push(imageUrl);
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`❌ Failed to upload image: ${file.filename}`);
      }
    }
  }

  // رفع صورة رئيسية جديدة إن وُجدت
  if (req.files["mainImage"]?.[0]) {
    const mainFile = req.files["mainImage"][0];
    mainImage = await uploadToGitHub({
      filePath: mainFile.path,
      originalName: mainFile.filename,
    });
    await fs.unlink(mainFile.path);
  }

  // دمج الصور القديمة مع الجديدة
  const oldImages = Array.isArray(req.body.oldImages) ? req.body.oldImages : [];

  const images = [...oldImages, ...newImages];
  let variable = JSON.parse(req.body.variable);
  let colors = JSON.parse(req.body.colors);
  // تحديث البيانات
  const productId = req.params.productId;
  const updatedData = {
    name: req.body.name,
    price: req.body.price,
    PrevPrice: req.body.PrevPrice || null,
    quantity: req.body.quantity,
    category: req.body.category,
    colors,
    variable,
    description: req.body.description,
    family: req.body.family,
    images,
  };
  
  if (mainImage) updatedData.mainImage = mainImage;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updatedData,
    { new: true }
  );

  if (!updatedProduct) {
    return next(appError.create("المنتج غير موجود", 404, statusText.FAIL));
  }

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم تعديل المنتح بنجاح",
    data: { updatedProduct },
  });
});

exports.deleteProduct = asyncWrapper(async (req, res, next) => {
  const deletedProduct = await Product.findOneAndDelete({
    _id: req.params.productId,
  });

  if (!deletedProduct) {
    return next(appError.create("المنتج غير موجود", 404, statusText.FAIL));
  }

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم حذف المنتح بنجاح",
    data: {
      deletedProduct,
    },
  });
});

exports.updateProductOffers = asyncWrapper(async (req, res, next) => {
  const productId = req.params.productId;

  if (!req.body.offers) {
    return next(appError.create("يرجى إرسال العروض", 400, statusText.FAIL));
  }

  let offers = [];
  try {
    offers = req.body.offers;
  } catch (error) {
    return next(appError.create("صيغة العروض غير صحيحة", 400, statusText.FAIL));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { offers },
    { new: true }
  );

  if (!updatedProduct) {
    return next(appError.create("المنتج غير موجود", 404, statusText.FAIL));
  }

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم تعديل العروض بنجاح",
    data: { updatedProduct },
  });
});

exports.publishProduct = asyncWrapper(async (req, res, next) => {
  const productId = req.params.productId;
  const isPublished = req.body.isPublished;
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { isPublished },
    { new: true }
  );

  if (!updatedProduct) {
    return next(appError.create("المنتج غير موجود", 404, statusText.FAIL));
  }

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم نشر المنتج بنجاح",
    data: { updatedProduct },
  });
});

exports.addLp = asyncWrapper(async (req, res, next) => {
  const productId = req.params.productId;
  const oldImages = req.body.oldLp || [];
  const newImages = [];
  for (const file of req.files) {
    const url = await uploadToGitHub({
      filePath: file.path,
      originalName: file.filename,
    });
    await fs.unlink(file.path);
    newImages.push(url);
  }

  const allImages = [...oldImages, ...newImages];

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { Lp: allImages },
    { new: true }
  );

  if (!updatedProduct) {
    return next(appError.create("المنتج غير موجود", 404, statusText.FAIL));
  }

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تمت إضافة الصور بنجاح",
    data: { updatedProduct },
  });
});

exports.addFav = asyncWrapper(async (req, res, next) => {
  const productId = req.params.productId;
  const bestPro = req.body.bestPro;
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { bestPro },
    { new: true }
  );

  if (!updatedProduct) {
    return next(appError.create("المنتج غير موجود", 404, statusText.FAIL));
  }

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم تعديل المنتج بنجاح",
    data: { updatedProduct },
  });
});


