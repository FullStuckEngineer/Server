const router = require('express').Router()
const productController = require("../../controllers/cms/productController")
const { authorization } = require("../../middlewares/auth")
const upload = require('../../middlewares/multer');

router.get("/", authorization(["Admin"]), productController.findAll)
router.get("/:slug", authorization(["Admin"]), productController.findOne)
router.post("/", authorization(["Admin"]), productController.create)
router.post("/uploads", authorization(["Admin"]), upload.single('image'), productController.uploadImage)
router.put("/:id", authorization(["Admin"]), productController.update)
router.delete("/:id", authorization(["Admin"]), productController.destroy)

module.exports = router
