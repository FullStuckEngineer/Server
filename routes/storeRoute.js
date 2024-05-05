const router = require('express').Router()
const storeController = require("../controllers/storeController")

router.get("/", storeController.findAll)
router.get("/:id", storeController.findOne)

module.exports = router
