const userService = require('../services/userService')

//User profile

const findOne = async (req, res, next) => {
  try {
    const user = await userService.findOne(req.loggedUser);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const params = { id: req.loggedUser.id, body: req.body };
    const updatedUser = await userService.update(params);

    return res.status(200).json({ message: "User Updated", data: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { findOne, update };
