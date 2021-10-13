const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/files");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml") || file.mimetype.includes("csv")) {
      cb(null, true);
    } else {
      req.fileValidationError = "Forbidden extension";
      cb("Please upload only excel/csv file.", false, req.fileValidationError);
    }
  },
}).array("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
