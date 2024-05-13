const storeService = require('../../services/storeService')

const findAll = async (req, res, next) => {
    try {
        const store = await storeService.findAll(req.loggedUser)
        res.status(200).json(store)
    } catch (error) {
        next(error)
    }
}

const findOne = async (req, res, next) => {
    try {
        const params = {user_id: req.loggedUser.id, id: req.params.id }
        const findStore = await storeService.findOne(params)
        res.status(200).json(findStore)
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const createStore = await storeService.create(req.body)
        res.status(201).json(createStore)
    } catch (error) {
        next(error) 
    }
}

const update = async (req, res, next) => {
    try {
        const params = { id: req.params.id, body: req.body }
        const updateStore = await storeService.update(params)
        res.status(200).json(updateStore)
    } catch (error) {
        next (error)
    }
 }

const destroy = async (req, res, next) => {
    try {
        const params = { id: req.params.id }
        await storeService.destroy(params)
        res.status(200).json({message: "Store Deleted"})
    } catch (error) {
        next (error)
    }
 }

module.exports = { findAll, findOne, create, update, destroy }
