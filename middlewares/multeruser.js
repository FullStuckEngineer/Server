const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './assets/users/');
  },
  filename: function (req, file, cb) {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, Date.now() + '-' + fileName);
  }
});

const maxSize = 1 * 1024 * 1024
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true)
    } else if (upload) {
      if (err instanceof multer.MulterError) {
        // A multer error when uplouding
        res.send(err)
      } else if (err) {
        //  An Uknown error when uplouding
      }
      //Everything went fine
    } else {
      cb(null, true)
      return cb(new Error("Only .png, .jpg and . jpeg format allowed !"))
    }
  },
  limits: { fileSize: maxSize },
})

module.exports = upload
