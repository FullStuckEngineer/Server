const checkoutService = require("../services/checkoutService")

const findAll = async (req, res, next) => {
  try {
    const params = {
      courier: req.query.courier,
      order_id: req.query.order_id,
      user: req.query.user,
      role: "user",
      loggedUser: req.loggedUser.id,
      currentPage: req.query.currentPage,
      perPage: req.query.perPage,
    }

    const findAll = await checkoutService.findAll(params)
    res.status(200).json({ message: "Success Get All Checkout", data: findAll })
  } catch (error) {
    next(error)
  }
}

const findOne = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      loggedUser: req.loggedUser.id,
      role: "user",
    }

    const findOne = await checkoutService.findOne(params)
    console.log(findOne)
    res.status(200).json({ message: "Success Get A Checkout", data: findOne })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const obj = { user_id: req.loggedUser.id, body: req.body }
    const createCheckout = await checkoutService.create(obj)
    res.status(200).json({ message: "Success Create Checkout", data: createCheckout })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      status: req.body.status,
      role: "user",
      loggedUser: req.loggedUser.id,
    }

    const update = await checkoutService.update(params)
    res.status(200).json({ message: "Success Update Checkout", data: update })
  } catch (error) {
    next(error)
  }
}

const pay = async (req, res, next) => {
  try {
    const obj = {
      id: req.params.id,
      role: req.loggedUser.role,
      loggedUser: req.loggedUser.id,
      bank: req.body.bank,
    }
    const createCheckout = await checkoutService.pay(obj)
    res.status(200).json(createCheckout)
  } catch (error) {
    next(error)
  }
}

const payNotification = async (req, res, next) => {
  try {
    const obj = { body: req.body }
    const createNotification = await checkoutService.payNotification(obj)
    res.status(200).json(createNotification)
  } catch (error) {
    next(error)
  }
}

const payManual = async (req, res, next) => {
  try {
    const obj = { loggedUser: req.loggedUser, body: req.file, params: req.params }
    const url = await checkoutService.payManual(obj)
    res.status(201).json({
      message: "Uploud Receipt Success, Wait for the Admin to Confirm Your Order",
      image_url: url,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  findAll,
  findOne,
  create,
  update,
  pay,
  payNotification,
  payManual,
}
