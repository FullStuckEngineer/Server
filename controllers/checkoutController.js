const checkoutService = require('../services/checkoutService')

const findAll = async (req, res, next) => {
    try {
        const findAll = await checkoutService.findAll(req.loggedUser)
        console.log(req.loggedUser)
        res.status(200).json(findAll)
    } catch (error) {
        next (error)
    }
} 

const findOne = async (req, res, next) => {} 

const create = async (req, res, next) => {
    try {
        const obj = { user_id: req.loggedUser.id, ...req.body }
        const createCheckout = await checkoutService.create(obj)
        res.status(200).json(createCheckout)
    } catch (error) {
        next (error)
    }
} 

const update = async (req, res, next) => {} 

module.exports = { findAll, findOne, create, update }
