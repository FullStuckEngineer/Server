const router = require("express").Router()
const path = require("path")
const express = require("express")
// web router
const addressRouter = require("./addressRoute")
const authRouter = require("./authRoute")
const cartRouter = require("./cartRoute")
const categoryRouter = require("./categoryRoute")
const checkoutRouter = require("./checkoutRoute")
const cityRouter = require("./cityRoute")
const courierRouter = require("./courierRoute")
const productRouter = require("./productRoute")
const storeRouter = require("./storeRoute")
const userRouter = require("./userRoute")

// CMS Router
const addressCmsRouter = require("./cms/addressRoute")
const categoryCmsRouter = require("./cms/categoryRoute")
const checkoutCmsRouter = require("./cms/checkoutRoute")
const cityCmsRouter = require("./cms/cityRoute")
const courierCmsRouter = require("./cms/courierRoute")
const productCmsRouter = require("./cms/productRoute")
const storeCmsRouter = require("./cms/storeRoute")
const userCmsRouter = require("./cms/userRoute")

router.use("/v1/api/payment_receipt/", express.static(path.join(__dirname, "../assets/uplouds/")))

const { authentication, authorization } = require("../middlewares/auth")

router.use("/v1/api/auth", authRouter)
router.use(authentication)
router.use("/v1/api/addresses", addressRouter)
router.use("/v1/api/carts", cartRouter)
router.use("/v1/api/categories", categoryRouter)
router.use("/v1/api/checkouts", checkoutRouter)
router.use("/v1/api/cities", cityRouter)
router.use("/v1/api/couriers", courierRouter)
router.use("/v1/api/products", productRouter)
router.use("/v1/api/stores", storeRouter)
router.use("/v1/api/users", userRouter)

// CMS Router
router.use("/v1/api/cms/addresses", addressCmsRouter)
router.use("/v1/api/cms/categories", categoryCmsRouter)
router.use("/v1/api/cms/checkouts", checkoutCmsRouter)
router.use("/v1/api/cms/cities", cityCmsRouter)
router.use("/v1/api/cms/couriers", courierCmsRouter)
router.use("/v1/api/cms/products", productCmsRouter)
router.use("/v1/api/cms/stores", storeCmsRouter)
router.use("/v1/api/cms/users", userCmsRouter)

module.exports = router
