const router = require('express').Router()
const categoryController = require("../../controllers/cms/categoryController")
const { authorization } = require("../../middlewares/auth")

router.get("/", authorization(["Admin"]), categoryController.findAll);
router.get("/:id", authorization(["Admin"]), categoryController.findOne);
router.post("/", authorization(["Admin"]), categoryController.create);
router.put("/:id", authorization(["Admin"]), categoryController.update);
router.delete("/:id", authorization(["Admin"]), categoryController.destroy);

module.exports = router
