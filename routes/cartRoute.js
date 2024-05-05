const router = require('express').Router()
const cartController = require("../controllers/cartController")

router.get("/:id", cartController.findOne)
router.put("/:id", cartController.update)
router.delete("/:id", cartController.destroy)
module.exports = router
