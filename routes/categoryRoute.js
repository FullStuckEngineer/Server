const router = require('express').Router()
const categoryController = require("../controllers/categoryController")
const { authorization } = require("../middlewares/auth")

router.get("/", authorization(["User"]), categoryController.findAll)
router.get("/:id", authorization(["User"]), categoryController.findOne)

module.exports = router