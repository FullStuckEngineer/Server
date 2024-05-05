const router = require('express').Router()
const courierController = require("../controllers/courierController")

router.get("/", courierController.findAll)
router.get("/:id", courierController.findOne)

module.exports = router
