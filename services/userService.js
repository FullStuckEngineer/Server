const prisma = require("../lib/prisma")
const hashPassword = require("../lib/bcrypt").hashPassword
const comparePassword = require("../lib/bcrypt").comparePassword

const findOne = async (params) => {
  try {
    console.log(params);
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        checkouts: true,
      },
    });
    if (!user) {
      throw ({ name: "ErrorNotFound", message: "User Not Found" })
    }

    return user;
  } catch (error) {
    throw ({ name: "ErrorFetch", message: "Error Fetching User" })
  }
};

const update = async (params) => {
  try {
    const { id, body } = params;

    // Initialize an empty object to store update fields
    const updateData = {};

    if (body.oldPassword && body.newPassword) {

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        throw { name: "ErrorNotFound", message: "User Not Found" };
      }
      const checkOldPass = comparePassword(body.oldPassword, user.password);
      if (!checkOldPass) {

        throw { name: "WrongOldPassword", message: "Wrong Old Password" };
      }
      updateData.password = hashPassword(body.newPassword);
    }

    // Add other fields to updateData if they exist in body
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.phone_number) updateData.phone_number = body.phone_number;

    console.log('Fields to be updated:', updateData);

    if (Object.keys(updateData).length > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
      });

      if (!updatedUser) {
        throw { name: "FailedUpdateUser", message: "Failed to update user" };
      }
      return updatedUser;
    } else {
      throw { name: "NoFieldsToUpdate", message: "No fields to update" };
    }
  } catch (error) {
    throw { name: "ErrorUpdate", message: error.message || "Error updating user" };
  }
};

const uploadImage = async (params) => {
  const { userId, filePath } = params;
  try {
    const data = {}

    if (filePath) {
      data.photo = filePath
    } else {
      data.photo = null
    }

    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: data,
    });

    if (!user) {
      throw { name: "ErrorUpload", message: "Failed to Upload Image" };
    }

    return user;
  } catch (error) {
    throw { name: "ErrorUpload", message: error.message || "Failed to Upload Image" };
  }
};

const deletePhoto = async (params) => {
  const { userId } = params;
  try {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: { photo: null },
    });

    if (!user) {
      throw { name: "ErrorDeletePhoto", message: "Failed to Delete Photo" };
    }

    return user;
  } catch (error) {
    throw { name: "ErrorDeletePhoto", message: error.message || "Failed to Delete Photo" };
  }
};

const destroy = async (params) => {
  const { user_id, id } = params;
  try {
    const findId = await prisma.user.findUnique({
      where: { user_id, id: Number(id) },
    });
    if (!findId) {
      throw ({ name: "ErrorNotFound", message: "User Not Found" })
    }
    const deleteUser = await prisma.user.delete({
      where: { user_id, id: Number(id) },
    });
    if (!deleteUser) {
      throw { name: "FailedToDeleteUser" };
    }

    return deleteUser;
  } catch (error) {
    throw ({ name: "ErrorDelete", message: "Failed to Delete User" })
  }
};

module.exports = { findOne, update, uploadImage, deletePhoto, destroy };
