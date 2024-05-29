const router = require('express').Router()
const userController = require("../../controllers/cms/userController")
const upload = require('../../middlewares/multeruser');

router.get("/", userController.findAll)
router.get("/:id", userController.findOne)
router.put("/:id", userController.update)
router.delete("/:id", userController.destroy)
router.post("/uploads", upload.single('image'), userController.uploadImage)
router.delete("/photo/:id", userController.deletePhoto)

module.exports = router
