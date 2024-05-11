const productService = require('../services/productService');

const perPage = 10;

const findAll = async (req, res, next) => {
    try {
        params = {
            page: req.query.page? parseInt(req.query.page) : 1,
            perPage: perPage,
            role: 'User'
        }

        const products = await productService.findAll(params);
        res.status(200).json({message: "Products Found", data:products});
    } catch(err){
        next(err);
    }
} 

const findOne = async (req, res, next) => {
    try {
        params = {
            id: req.params.id,
            role: 'User'
        }
        const product = await productService.findOne(params);
        res.status(200).json({message: "Product By ID Found", data:product});
    } catch (err){
        next(err);
    }
} 

module.exports = { findAll, findOne }