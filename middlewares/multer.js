const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets/products/');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10000000
    }
});

module.exports = upload;
