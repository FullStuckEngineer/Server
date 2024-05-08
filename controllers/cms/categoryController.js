const categoryService = require('../../services/categoryService')

const findAll = async (req, res, next) => {
    try{
        const categories = await categoryService.findAll()
        res.status(200).json({message: "Category Data Found", data: categories})
    } catch(err){
        next(err)
    }
} 

const findOne = async (req, res, next) => {
    try{
        const category = await categoryService.findOne(req.params)
        res.status(200).json({message: "Category Data By ID Found", data: category})
    } catch(err){
        next(err)
    }
} 

const create = async (req, res, next) => {
    try{
        const category = await categoryService.create(req.body)
        res.status(201).json({message: "Category Created", data: category})
    } catch(err){
        next(err)
    }
} 

const update = async (req, res, next) => {
    try{
        const { id } = req.params;
        req.body.id = parseInt(id);
        const category = await categoryService.update(req.body)
        res.status(200).json({message: "Category Updated", data: category})
    } catch(err){
        next(err)
    }
} 

const destroy = async (req, res, next) => {
    try{
        const category = await categoryService.destroy(req.body)
        res.status(200).json({message: "Category Deleted", data: category})
    } catch(err){
        next(err)
    }
} 

module.exports = { findAll, findOne, create, update, destroy}
