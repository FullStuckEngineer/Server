const cityService = require('../services/cityService')

const findAll = async (req, res, next) => {
    try {
        const getAll = await cityService.findAll()
        res.status(200).json(getAll)
    } catch (error) {
        next (error)
    }
} 

const findOne = async (req, res, next) => {} 

module.exports = { findAll, findOne }
