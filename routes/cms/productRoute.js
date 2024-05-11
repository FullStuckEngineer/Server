const router = require('express').Router()
const productController = require("../../controllers/cms/productController")
const { authorization } = require("../../middlewares/auth")
const upload = require('../../middlewares/multer');

router.get("/", authorization(["admin"]), productController.findAll)
router.get("/:slug", authorization(["admin"]), productController.findOne)
router.post("/", authorization(["admin"]), productController.create)
router.post("/uploads", authorization(["admin"]), upload.single('image'), productController.uploadImage)
router.put("/:id", authorization(["admin"]), productController.update)
router.delete("/:id", authorization(["admin"]), productController.destroy)

module.exports = router
