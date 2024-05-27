const courierService = require("../../services/courierService");

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

const create = async (req, res, next) => {
  try {
    const obj = {...req.body}
    const newCourier = await courierService.create(obj);
    res.status(201).json({messsage: "Courier Added" ,data: newCourier});
  
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const obj = {...req.body , ...req.params}
    const updatedCourier = await courierService.update(obj);
    res.status(201).json({ message: "Courier Update Succesfull" , data: updatedCourier});
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    
    const deletedCourier = await courierService.destroy(req.params);
    res.status(201).json({ message: "Courier has Deleted" , data : deletedCourier});
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne, create, update, destroy };
