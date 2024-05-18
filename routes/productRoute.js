const router = require('express').Router()
const productController = require("../controllers/productController")
const { authorization } = require("../middlewares/auth")

router.get("/", authorization(["user"]), productController.findAll)
router.get("/:slug", authorization(["user"]), productController.findOne)

module.exports = router
