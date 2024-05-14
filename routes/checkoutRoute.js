const router = require('express').Router()
const checkoutController = require("../controllers/checkoutController")

router.get("/", checkoutController.findAll)
router.get("/:id", checkoutController.findOne)
router.post("/", checkoutController.create)
router.post("/pay/:id", checkoutController.pay)
router.put("/:id", checkoutController.update)

module.exports = router
