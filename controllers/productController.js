const productService = require('../services/productService')

const findAll = async (req, res, next) => {
    try {
        const products = await productService.findAll();
        res.status(200).json({message: "Products Found", data:products});
    } catch(err){
        next(err);
    }
} 

const findOne = async (req, res, next) => {
    try {
        const product = await productService.findOne(req.params);
        res.status(200).json({message: "Product By ID Found", data:product});
    } catch (err){
        next(err);
    }
} 

module.exports = { findAll, findOne }