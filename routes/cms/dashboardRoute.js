const express = require('express');
const router = express.Router();
const { authorization } = require("../../middlewares/auth")
const dashboardController = require("../../controllers/cms/dashboardController")

router.get('/', authorization(["admin"]), dashboardController.getDashboardData);

module.exports = router;
