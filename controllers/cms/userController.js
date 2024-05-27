const userService = require('../../services/userService')

const perPage = 10;

const findAll = async (req, res, next) => {
    try{
        params = {
            page: req.query.page? parseInt(req.query.page) : 1,
            perPage: perPage,
            searchTerm: req.query.searchTerm,
            role: req.query.role,
            sortBy: req.query.sortBy
        }

        const users = await userService.findAll(params)
        res.status(200).json({message: "Success Get All Users", data: users})
    } catch(err){
        next(err)
    }
} 
const findOne = async (req, res, next) => {
    try {
        req.params.id = parseInt(req.params.id);
      const user = await userService.findOne(req.params);
      res.status(200).json({message: "Success Get User", data: user})
    } catch (error) {
      next(error);
    }
  };
  
const update = async (req, res, next) => {
try {
    req.params.id = parseInt(req.params.id);
    const params = { id: req.params.id, body: req.body };
    const updatedUser = await userService.update(params);

    return res.status(200).json({ message: "User Updated", data: updatedUser });
} catch (error) {
    next(error);
}
};

const destroy = async (req, res, next) => {
    try{
        params = {
            id: req.params.id
        }

        const user = await userService.destroy(params)
        res.status(200).json({message: "User Deleted", data: user})
    } catch(err){
        next(err)
    }
} 

module.exports = { findAll, findOne, update, destroy }
