const router = require("express").Router()
const checkoutController = require("../controllers/checkoutController")
const { authorization } = require("../middlewares/auth")
const upload = require("../middlewares/multeruser")

router.get("/", authorization(["user"]), checkoutController.findAll)
router.get("/:id", authorization(["user"]), checkoutController.findOne)
router.post("/", authorization(["user"]), checkoutController.create)
router.post("/pay/:id", authorization(["user"]), checkoutController.pay)
router.post("/pay/midtrans/handle_notification", authorization(["user"]), checkoutController.payNotification)
router.put("/:id", authorization(["user"]), checkoutController.update)
router.post("/uplouds/:id", authorization(["user"]), upload.single("file"), checkoutController.payManual)

module.exports = router
