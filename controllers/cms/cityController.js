const cityService = require("../../services/cityService");

const perPage = 10;

const findAll = async (req, res, next) => {
    try {
        params = {
            page: req.query.page? parseInt(req.query.page) : 1,
            perPage: perPage,
            searchTerm: req.query.searchTerm,
        }
        const cities = await cityService.findAll(params);
        res.status(200).json({message: "Success Get All Cities", data: cities})
    } catch (error) {
        next(error);
    }
};

const findOne = async (req, res, next) => {
    try {
        const params = req.params;
        const city = await cityService.findOne(params);
        res.status(200).json({message: "Success Get City", data: city});  }
    catch (error) {
        next(error)
    }
};

module.exports = { findAll, findOne };
