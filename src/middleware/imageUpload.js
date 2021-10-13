const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, '-'));
  }
})

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;