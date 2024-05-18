const router = require('express').Router()
const checkoutController = require("../controllers/checkoutController")
const { authorization } = require("../middlewares/auth")

router.get("/",  authorization(["user"]), checkoutController.findAll)
router.get("/:id", authorization(["user"]), checkoutController.findOne)
router.post("/", authorization(["user"]), checkoutController.create)
router.post("/pay/:id", authorization(["user"]), checkoutController.pay)
router.put("/:id", authorization(["user"]), checkoutController.update)

module.exports = router
