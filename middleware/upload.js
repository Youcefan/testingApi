const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const appError = require("../utils/appError")

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `product-${uuidv4()}.${ext}`;  // إضافة UUID لتوليد اسم فريد
    cb(null, fileName);
  },
});
const fileFilter = function(req, file, cb){
  const type = file.mimetype.split("/")[0];
  if(type === "image"){
    return cb(null,true)
  } else {
    return cb(appError.create("file must be an image",400,"fails"),false)
  }
}
const upload = multer({ storage: diskStorage , fileFilter });

module.exports = upload