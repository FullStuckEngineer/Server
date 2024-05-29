const router = require('express').Router()
const checkoutController = require("../../controllers/cms/checkoutController")
const { authorization } = require("../../middlewares/auth")

router.get("/",  authorization(["admin"]), checkoutController.findAll)
router.get("/:id",  authorization(["admin"]), checkoutController.findOne)
router.post("/",  authorization(["admin"]), checkoutController.create)
router.put("/:id",  authorization(["admin"]), checkoutController.update)
router.post("/email-notif", authorization(["admin"]), checkoutController.sendEmailNotification);

module.exports = router
