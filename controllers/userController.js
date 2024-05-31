const userService = require('../services/userService')

//User profile

const findOne = async (req, res, next) => {
  try {
    const user = await userService.findOne(req.loggedUser);
    console.log(req.loggedUser, "INI DATA USER")
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

const uploadImage = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const userId = req.loggedUser.id;
    const uploadImage = await userService.uploadImage({ userId, filePath });
    res.status(200).json({ message: "Image Uploaded", data: uploadImage });
  } catch (err) {
    next(err);
  }
}

const deletePhoto = async (req, res, next) => {
  try {
    const userId = req.loggedUser.id;
    const deletePhoto = await userService.deletePhoto({ userId });
    res.status(200).json({ message: "Photo Deleted", data: deletePhoto });
  } catch (err) {
    next(err);
  }
}

module.exports = { findOne, update, uploadImage, deletePhoto };
