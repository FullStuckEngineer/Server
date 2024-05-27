const courierService = require("../services/courierService");

const perPage = 10;

const findAll = async (req, res, next) => {
  try {
    params = {
      page: req.query.page? parseInt(req.query.page) : 1,
      perPage: perPage,
      searchTerm: req.query.searchTerm,
    }
    const couriers = await courierService.findAll(params);
    res.status(200).json({message: "Success Get All Couriers", data: couriers})
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const courier = await courierService.findOne(req.params);
    res.status(200).json({message: "Success Get Courier", data: courier})
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne };
