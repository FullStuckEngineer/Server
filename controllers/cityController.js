const cityService = require("../services/cityService");

const perPage = 10;

const findAll = async (req, res, next) => {
    try {
        const params = req.query;
        const cities = await cityService.findAll(params);
        res.status(200).json(cities);
    } catch (error) {
        next(error);
    }
};

const findAllWithLimit = async (req, res, next) => {
  try {
    const params = req.query;
    const cities = await cityService.findAllWithLimit(params);
    res.status(200).json(cities);
  } catch (error) {
    next(error);
  }
};

const findAllWithNoLimit = async (req, res, next) => {
    try {
        const params = req.query;
        const cities = await cityService.findAllWithNoLimit(params);
        res.status(200).json(cities);
    } catch (error) {
        next(error);
    }
};

const findOne = async (req, res, next) => {
    try {
        const id = req.params.id;
        const city = await cityService.findOne(id);
        res.status(200).json(city)
    }
    catch (error) {
        next(error)
    }
};



module.exports = { findAll, findOne, findAllWithNoLimit, findAllWithLimit };
