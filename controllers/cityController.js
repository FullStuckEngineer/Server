const cityService = require("../../services/cityService");

const findAll = async (req, res, next) => {
    try {
        const params = req.params;
        const cities = await cityService.findAll(params);
        res.status(200).json(cities);
    } catch (error) {
        next(error);
    }
};

const findOne = async (req, res, next) => {
    try {
        const params = req.params;
        const city = await cityService.findOne(params);
        res.status(200).json(city)
    }
    catch (error) {
        next(error)
    }
};

module.exports = { findAll, findOne };
