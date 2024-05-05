const router = require('express').Router()
// web router 
const addressRouter = require('./addressRoute') 
const authRouter = require('./authRoute')
const cartRouter = require('./cartRoute')
const categoryRouter = require('./categoryRoute')
const checkoutRouter = require('./checkoutRoute')
const cityRouter = require('./cityRoute')
const courierRouter = require('./courierRoute')
const productRouter = require('./productRoute')
const storeRouter = require('./storeRoute')
const userRouter = require('./userRoute')

// CMS Router
const addressCmsRouter = require('./cms/addressRoute') 
const categoryCmsRouter = require('./cms/categoryRoute')
const checkoutCmsRouter = require('./cms/checkoutRoute')
const cityCmsRouter = require('./cms/cityRoute')
const courierCmsRouter = require('./cms/courierRoute')
const productCmsRouter = require('./cms/productRoute')
const storeCmsRouter = require('./cms/storeRoute')
const userCmsRouter = require('./cms/userRoute')

const {authentication , authorization } = require("../middlewares/auth")

router.use("/api/auth", authRouter)
router.use(authentication)
router.use("/api/addresses", addressRouter)
router.use("/api/carts", cartRouter)
router.use("/api/categories", categoryRouter)
router.use("/api/checkouts", checkoutRouter)
router.use("/api/cities", cityRouter)
router.use("/api/couriers", courierRouter)
router.use("/api/products", productRouter)
router.use("/api/stores", storeRouter)
router.use("/api/users", userRouter)

// CMS Router
router.use("/api/cms/addresses", addressCmsRouter)
router.use("/api/cms/categories", categoryCmsRouter)
router.use("/api/cms/checkouts", checkoutCmsRouter)
router.use("/api/cms/cities", cityCmsRouter)
router.use("/api/cms/couriers", courierCmsRouter)
router.use("/api/cms/products", productCmsRouter)
router.use("/api/cms/stores", storeCmsRouter)
router.use("/api/cms/users", userCmsRouter)


module.exports = router

