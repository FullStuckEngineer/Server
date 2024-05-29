const prisma = require("../lib/prisma")

const findAll = async (params) => {
  try {
      const { page = 1, perPage = 10, role = '', searchTerm = '', status = '', sortBy = '' } = params;

      const offset = (page - 1) * perPage;
      const limit = perPage;

      let where = {};
      if (role) {
          where.role = role;
      }
      if (status) {
          where.status = status;
      }
      if (searchTerm) {
          where.OR = [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { email: { contains: searchTerm, mode: 'insensitive' } },
              { role: { contains: searchTerm, mode: 'insensitive' } },
          ];
      }

      const totalCount = await prisma.user.count({ where });

      const orderBy = sortBy ? { [sortBy]: 'asc' } : undefined;

      const users = await prisma.user.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy,
      });

      if (!users || users.length === 0) {
          throw { name: "ErrorNotFound", message: "Users Not Found" };
      }

      const totalPages = Math.ceil(totalCount / perPage);
      return { users, totalPages };
  } catch (error) {
      console.error(error);
      throw { name: "ErrorNotFound", message: "Users Not Found" };
  }
};

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
    throw ({ name: "ErrorNotFound", message: "User Not Found" })
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
    if (error.name && error.message) {
        throw error;
    } else {
        throw { name: "ErrorUpdate", message: error.message || "Error updating user" };
    }
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
  const { id } = params;
  try {
    await prisma.$transaction(async (prisma) => {

      const findId = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!findId) {
        throw ({ name: "ErrorNotFound", message: "User Not Found" })
      }

      // Delete User
      const deleteUser = await prisma.user.delete({
        where: { id: Number(id) },
      });
      if (!deleteUser) {
        throw { name: "FailedToDeleteUser" };
      }

      // Delete User's Address
      const deleteAddress = await prisma.address.deleteMany({
        where: { user_id: Number(id) },
      });
      if (!deleteAddress) {
        throw { name: "FailedToDeleteAddress" };
      }

      // Delete User's Cart
      const deleteCart = await prisma.cart.deleteMany({
        where: { user_id: Number(id) },
      });
      if (!deleteCart) {
        throw { name: "FailedToDeleteCart" };
      }

      // Delete User's Checkouts
      const deleteCheckouts = await prisma.checkout.deleteMany({
        where: { user_id: Number(id) },
      });

      if (!deleteCheckouts) {
        throw { name: "FailedToDeleteCheckouts" };
      }

      return deleteUser;
    });
  } catch (error) {
    if (error.name && error.message) {
        throw error;
    } else {
        throw { name: "ErrorDelete", message: "Failed to Delete User" }
    }
  }
};

module.exports = { findAll, findOne, update, uploadImage, deletePhoto, destroy };
