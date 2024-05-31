const router = require('express').Router()
const courierController = require("../controllers/courierController")

router.get("/", courierController.findAll)
router.get("/:id", courierController.findOne)
router.get("/shipping-methods/:courierId", courierController.getShippingMethod)

module.exports = router
