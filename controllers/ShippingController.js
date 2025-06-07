const asyncWrapper = require("../middleware/asyncWrapper");
const ShippingPrice = require("../models/ShippingPrice");
const appError = require("../utils/appError");
const statusText = require("../utils/status");

// إنشاء ولاية (مؤقت فقط أثناء الإعداد)
exports.createShipping = asyncWrapper(async (req, res, next) => {
  const { wilaya } = req.body;

  if (!wilaya) {
    return next(appError.create("اسم الولاية مطلوب", 400, statusText.FAIL));
  }

  const shipping = new ShippingPrice({ wilaya });
  await shipping.save();

  res.status(201).json({
    status: 201,
    statusText: statusText.SUCCESS,
    data: { shipping },
  });
});

// جلب كل أسعار التوصيل
exports.getShipping = asyncWrapper(async (req, res, next) => {
  const shipping = await ShippingPrice.find({}, { __v: 0 });

  res.status(200).json({
    status: 200,
    statusText: statusText.SUCCESS,
    message: shipping.length === 0 ? "لا توجد نتائج" : undefined,
    data: { shipping },
  });
});

// تعديل سعر التوصيل لولاية معينة
exports.updateShipping = asyncWrapper(async (req, res, next) => {
  const { shippingId } = req.params;
  const { wilaya, toHome, toOffice } = req.body;

  const updatedData = {};
  if (wilaya) updatedData.wilaya = wilaya;
  if (typeof toHome === "number") updatedData.toHome = toHome;
  if (typeof toOffice === "number") updatedData.toOffice = toOffice;

  const updatedShipping = await ShippingPrice.findByIdAndUpdate(
    shippingId,
    updatedData,
    { new: true }
  );

  if (!updatedShipping) {
    return next(appError.create("الولاية غير موجودة", 404, statusText.FAIL));
  }

  res.status(200).json({
    status: statusText.SUCCESS,
    message: "تم تعديل بيانات الولاية بنجاح",
    data: { updatedShipping },
  });
});
