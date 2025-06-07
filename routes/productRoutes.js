const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const validateObjectId = require("../middleware/validateObjectId");
const validateRequest = require("../middleware/validateRequest");
const upload = require("../middleware/upload");

const {
  createProductValidation,
  updateProductValidation,
} = require("../validations/productValidation");

// Create Product
router.post(
  "/",
  upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "images" }]),
  createProductValidation,
  validateRequest,
  productController.createProduct
);

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

// GET ALL PRODUCTS WITH MINI DATA
router.get("/miniAllData", productController.getminAllProducts);


// GET PRODUCT
router.get("/:productId", validateObjectId(), productController.getProduct);

// UPDATE PRODUCT
router.patch(
  "/:productId",
  upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "newImages" }]),
  validateObjectId(),
  updateProductValidation,
  validateRequest,
  productController.updateProduct
);

// DELETE PRODUCT
router.delete(
  "/:productId",
  validateObjectId(),
  productController.deleteProduct
);

// ADD OFFRE
router.patch(
  "/Offers/:productId",
  validateObjectId(),
  productController.updateProductOffers
);

//PUBLISH PRODUCT
router.patch(
  "/publish/:productId",
  validateObjectId(),
  productController.publishProduct
);

//Add LP
router.patch(
  "/addLp/:productId",
  upload.array("newLp"),
  validateObjectId(),
  productController.addLp
);

//Add Fav
router.patch(
  "/addFav/:productId",
  validateObjectId(),
  productController.addFav
);

module.exports = router;
