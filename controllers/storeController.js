const storeService = require('../services/storeService')

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
        const params = { user_id: req.loggedUser.id, id: req.params.id }
        const findStore = await storeService.findOne(params)
        res.status(200).json(findStore)
    } catch (error) {
        next(error)

    }
}

module.exports = { findAll, findOne }
