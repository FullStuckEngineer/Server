const router = require('express').Router()
const userController = require("../../controllers/cms/userController")

router.get("/", userController.findAll)
router.get("/:id", userController.findOne)
router.put("/:id", userController.update)
router.delete("/:id", userController.destroy)

module.exports = router
