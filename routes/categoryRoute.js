const router = require('express').Router()
const categoryController = require("../controllers/categoryController")
const { authorization, authentication } = require("../middlewares/auth")

router.use(authentication);

router.get("/", authorization(["User"]), categoryController.findAll)
router.get("/:id", authorization(["User"]), categoryController.findOne)

module.exports = router