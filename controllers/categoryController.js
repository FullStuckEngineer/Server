const categoryService = require('../services/categoryService');

const perPage = 10;

const findAll = async (req, res, next) => {
    try{
        params = {
            page: req.query.page? parseInt(req.query.page) : 1,
            perPage: perPage,
            role: 'User'
        }

        const categories = await categoryService.findAll(params);
        res.status(200).json({message: "Category Data Found", data: categories});
    } catch(err){
        next(err);
    }
} 

const findOne = async (req, res, next) => {
    try{
        const category = await categoryService.findOne(req.params);
        res.status(200).json({message: "Category Data By ID Found", data: category});
    } catch(err){
        next(err);
    }
} 

module.exports = { findAll, findOne}
