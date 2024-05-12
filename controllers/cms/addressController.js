const addressService = require('../../services/addressService')

const findAll = async (req, res, next) => {
    try {
        const address = await addressService.findAll(req.loggedUser)
        res.status(200).json(address)
    } catch (error) {
        next(error)
    }
}

const findOne = async (req, res, next) => {
    try {
        const params = { user_id: req.loggedUser.id, id: req.params.id }
        const findAddress = await addressService.findOne(params)
        res.status(200).json(findAddress)
    } catch (error) {
        next(error)
    }
 }

const create = async (req, res, next) => {
    try {
        const obj = { user_id: req.loggedUser.id, ...req.body }
        const newAddress = await addressService.create(obj)
        res.status(201).json({ 
            message: "New Address Added", 
            data: newAddress })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        console.log(req.loggedUser)
        const params = { user_id: req.loggedUser.id, id: req.params.id, body: req.body }
        const updateAddress = await addressService.update(params)
        res.status(200).json({message: "Address Updated", data: updateAddress})
    } catch (error) {
        next(error)
    }
 }

const destroy = async (req, res, next) => {
    try {
        const params = { user_id: req.loggedUser.id, id: req.params.id }
        await addressService.destroy(params)
        res.status(200).json({message: "Address Deleted"})
    } catch (error) {
        next(error)
    }
 }


module.exports = { findAll, findOne, create, update, destroy }
