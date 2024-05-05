const router = require('express').Router()
const cityController = require("../controllers/cityController")

router.get("/", cityController.findAll)
router.get("/:id", cityController.findOne)

module.exports = router
