const router = require('express').Router()
const courierController = require("../../controllers/cms/courierController")

router.get("/", courierController.findAll)
router.get("/:id", courierController.findOne)
router.post("/", courierController.create)
router.put("/:id", courierController.update)
router.delete("/:id", courierController.destroy)

module.exports = router
