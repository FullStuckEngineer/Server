const router = require('express').Router()
const checkoutController = require("../../controllers/cms/checkoutController")

router.get("/", checkoutController.findAll)
router.get("/:id", checkoutController.findOne)
router.post("/", checkoutController.create)
router.put("/:id", checkoutController.update)

module.exports = router
