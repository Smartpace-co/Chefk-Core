let User = require("../models").users;
let utils = require("../helpers/utils");
const uploadImage = require("../middleware/imageUpload");
const uploadFile = require("../middleware/fileUpload");
let { StatusCodes } = require("http-status-codes");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];
const file_upload_location = config.file_upload_location;

module.exports = {
  checkEmailConflict: async (email) => {
    try {
      const user = await User.count({
        where: { email: email },
      });
      if (user) {
        return utils.responseGenerator(StatusCodes.CONFLICT, "Email conflict");
      }
      return utils.responseGenerator(StatusCodes.OK, "No email conflict");
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  checkPhoneNumberConflict: async (phone_number) => {
    try {
      const user = await User.count({
        where: { phone_number: phone_number },
      });
      if (user) {
        return utils.responseGenerator(StatusCodes.CONFLICT, "Phone number conflict");
      }
      return utils.responseGenerator(StatusCodes.OK, "No phone number conflict");
    } catch (err) {
      console.log("Error ==> ", err);
      throw err;
    }
  },
  fileUpload: async (req, res) => {
    try {
      await uploadFile(req, res);

      if (req.files == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }

      let results = req.files.map((file) => {
        return {
          mediaName: file.filename,
          origMediaName: file.originalname,
          mediaPath: "http://" + req.headers.host + "/uploads/files/" + file.filename,
        };
      });
      return utils.responseGenerator(StatusCodes.OK, "File uploaded successfully", results);
    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, "File size cannot be larger than 2MB!");
      }
      if (req.fileValidationError) {
        return utils.responseGenerator(StatusCodes.BAD_REQUEST, err);
      }
      console.log("Error ==> ", err, req.fileValidationError);
      throw err;
    }
  },
  getDemoFile: async (req, res, entityType) => {
    try {
      const fileName = entityType + ".xlsx";
      const file = file_upload_location + "/" + fileName;
      res.download(file, req.params.fileName, (error) => {
        if (error) res.status(error.statusCode).send({ status: error.statusCode, message: error.message });
      });
    } catch (err) {
      throw err;
    }
  },
};
