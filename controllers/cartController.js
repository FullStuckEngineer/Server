const cartService = require('../services/cartService')

const findOne = async (req, res, next) => {
  try {
    const cart = await cartService.findOne(req.loggedUser)
    res.status(200).json(cart)
  } catch (error) {
    next(error)
  }
}

const getShippingCost = async (req, res, next) => {
  //Get shippingCost from RajaOngkir
  // kirim city_id, kirim total_weight ke RajaOngkir
  // kirim courier = JNE, PostIndonesia, TIKI
}

const update = async (req, res, next) => {
  try {
    const params = { id: req.params.id, body: req.body }
    const updatedCart = await cartService.update(params)
    res.status(200).json({ message: "Cart Updated", data: updatedCart })
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    const params = { id: req.loggedUser.id, idShoppingItem: req.params.id }
    await cartService.destroy(params)
    res.status(200).json({ message: "Cart Deleted" })
  } catch (error) {
    next(error)
  }
}

module.exports = { findOne, getShippingCost, update, destroy }