const express = require("express");
const router = express.Router();
const ShippingController = require("../controllers/ShippingController")

// ✅ جلب جميع الأسعار
router.get("/", ShippingController.getShipping);

// ✅ تعديل سعر التوصيل لولاية معينة (by ID)
router.patch("/:shippingId", ShippingController.updateShipping);

// ✅ إضافة ولاية جديدة (مؤقت فقط – احذفه بعد الإعداد)
router.post("/", ShippingController.createShipping);

module.exports = router;
