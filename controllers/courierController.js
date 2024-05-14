const courierService = require("../services/courierService");

const findAll = async (req, res, next) => {
  try {
    const user = await courierService.findAll(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const user = await courierService.findOne(req.params);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne };