const router = require('express').Router()
const productController = require("../controllers/productController")
const { authorization } = require("../middlewares/auth")

router.get("/", productController.findAll)
router.get("/:slug", productController.findOne)

module.exports = router
