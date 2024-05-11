const router = require('express').Router()
const categoryController = require("../controllers/categoryController")
const { authorization } = require("../middlewares/auth")

router.get("/", authorization(["user"]), categoryController.findAll)
router.get("/:id", authorization(["user"]), categoryController.findOne)

module.exports = router