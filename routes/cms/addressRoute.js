const router = require('express').Router()
const addressController = require("../../controllers/cms/addressController")
const { authorization } = require("../../middlewares/auth")

router.get("/",authorization(["admin"]), addressController.findAll)
router.get("/:id",authorization(["admin"]), addressController.findOne)
router.post("/",authorization(["admin"]), addressController.create)
router.put("/:id",authorization(["admin"]), addressController.update)
router.delete("/:id",authorization(["admin"]), addressController.destroy)

module.exports = router
