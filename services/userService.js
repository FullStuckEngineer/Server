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
      throw { name: "ErrorFetch", message: "Error Fetching Users" };
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
    throw ({ name: "ErrorFetch", message: "Error Fetching User" })
  }
};

const update = async (params) => {
  try {
    const { id, body } = params;
    const newPassword = body.password;

    if (newPassword) {
      body.password = hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: body,
    });

    if (!updatedUser) {
      throw { name: "FailedUpdateUser" };
    }
    return updatedUser;
  } catch (error) {
    throw ({ name: "ErrorUpdate", message: "Failed to Update User" })
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
    throw ({ name: "ErrorDelete", message: "Failed to Delete User" })
  }
};

module.exports = { findAll, findOne, update, destroy };
