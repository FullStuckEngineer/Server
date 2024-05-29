const addressService = require('../../services/addressService')

const perPage = 10;

const findAll = async (req, res, next) => {
    try{
        params = {
            page: req.query.page? parseInt(req.query.page) : 1,
            perPage: perPage,
            searchTerm: req.query.searchTerm,
            userId: req.query.userId,
            cityId: req.query.cityId,
            sortBy: req.query.sortBy
        }

        console.log("HEREEEEEEE params ", params);

        const addresses = await addressService.findAll(params)
        res.status(200).json({message: "Success Get All Addresses", data: addresses})
    } catch(err){
        next(err)
    }
} 
const findOne = async (req, res, next) => {
    try {
        const params = { user_id: -999, id: req.params.id }
        const findAddress = await addressService.findOne(params)
        res.status(200).json({message: "Success Get Address", data: findAddress})
    } catch (error) {
        next(error)
    }
 }

const create = async (req, res, next) => {
    try {
        const params = { user_id: -999, body: req.body }
        const newAddress = await addressService.create(params)
        res.status(200).json({ 
            message: "New Address Added", 
            data: newAddress })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const params = { user_id: -999, id: req.params.id, body: req.body }
        const updateAddress = await addressService.update(params)
        res.status(200).json({message: "Address Updated", data: updateAddress})
    } catch (error) {
        next(error)
    }
 }

const destroy = async (req, res, next) => {
    try {
        const params = { user_id: -999, id: req.params.id }
        await addressService.destroy(params)
        res.status(200).json({message: "Address Deleted"})
    } catch (error) {
        next(error)
    }
 }


module.exports = { findAll, findOne, create, update, destroy }
