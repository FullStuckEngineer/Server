const router = require('express').Router()
const categoryController = require("../controllers/categoryController")

router.get("/", categoryController.findAll)
router.get("/:id", categoryController.findOne)

module.exports = router
