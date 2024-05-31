const router = require('express').Router()
const userController = require("../controllers/userController")
const upload = require('../middlewares/multeruser');

router.get("/", userController.findOne)
router.put("/", userController.update)
router.post("/uploads", upload.single('image'), userController.uploadImage)
router.delete("/:id", userController.deletePhoto)

module.exports = router
