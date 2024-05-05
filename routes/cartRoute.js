const router = require('express').Router()
const cartController = require("../controllers/cartController")
const { authorization } = require("../middlewares/auth")

router.get("/",authorization(["user"]), cartController.findOne)
router.put("/:id", cartController.update)
router.delete("/:id", cartController.destroy)
module.exports = router
