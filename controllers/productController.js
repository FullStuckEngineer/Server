const productService = require('../services/productService');

const perPage = 100;

const findAll = async (req, res, next) => {
    try {
        params = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            perPage: perPage,
            role: 'User',
            searchTerms: req.query.searchTerms,
            categoryId: req.query.categoryId,
            status: req.query.status,
            sortBy: req.query.sortBy
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
            slug: req.params.slug,
            role: 'User'
        }
        const product = await productService.findOne(params);
        res.status(200).json({message: "Product By ID Found", data:product});
    } catch (err){
        next(err);
    }
} 

module.exports = { findAll, findOne }