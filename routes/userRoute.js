const router = require('express').Router()
const userController = require("../controllers/userController")

router.get("/", userController.findOne)
router.put("/:id", userController.update)

module.exports = router
