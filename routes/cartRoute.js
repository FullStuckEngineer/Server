const router = require('express').Router()
const cartController = require("../controllers/cartController")
const { authorization } = require("../middlewares/auth")

router.get("/",authorization(["user"]), cartController.findOne);
router.get("/shipping_costs", cartController.getShippingCost);
router.put("/:id", cartController.update);
router.delete("/:id", cartController.destroy);
//id product yang akan di hapus
module.exports = router
