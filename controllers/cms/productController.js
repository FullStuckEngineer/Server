const productService = require('../../services/productService');

const perPage = 10;

const findAll = async (req, res, next) => {
    try{
        params = {
            page: req.query.page? parseInt(req.query.page) : 1,
            perPage: perPage,
            role: 'Admin',
            searchTerms: req.query.searchTerms,
            categoryId: req.query.categoryId,
            status: req.query.status,
            sortBy: req.query.sortBy
        }

        const products = await productService.findAll(params);
        res.status(200).json({message: "Products Found", data: products});
    } catch(err){
        next(err);
    }
} 

const findOne = async (req, res, next) => {
    try{
        params = {
            slug: req.params.slug,
            role: 'Admin'
        }

        const product = await productService.findOne(params);
        res.status(200).json({message: "Product By ID Found", data:product});
    } catch(err){
        next(err);
    }
} 

const create = async (req, res, next) => {
    try{    
        const product = await productService.create(req.body);
        res.status(200).json({message: "Product Created", data:product});
    } catch(err){
        next(err);
    }
} 

const uploadImage = async (req, res, next) => {
    try {
        const filePath = req.file.path;
        const productId = req.body.id;
        const uploadImage = await productService.uploadImage({productId, filePath});

        res.status(200).json({message: "Image Uploaded", data:uploadImage});
    } catch(err){
        next
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        req.body.id = parseInt(id);
        const product = await productService.update(req.body);
        res.status(200).json({message: "Product Updated", data:product});
    } catch(err){
        next(err);
    }
} 

const destroy = async (req, res, next) => {
    try {
        const product = await productService.destroy(req.params);
        res.status(200).json({message: "Product Deleted", data:product});
    } catch(err){
        next(err);
    }
} 

module.exports = { findAll, findOne, create, update, destroy, uploadImage }