const router = require('express').Router()
const userController = require("../controllers/userController")

router.get("/", userController.findAll)
router.get("/:id", userController.findOne)
router.put("/:id", userController.update)

module.exports = router
