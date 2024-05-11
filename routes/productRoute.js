const router = require('express').Router()
const productController = require("../controllers/productController")
const { authorization } = require("../middlewares/auth")

router.get("/", authorization(["User"]), productController.findAll)
router.get("/:slug", authorization(["User"]), productController.findOne)

module.exports = router
