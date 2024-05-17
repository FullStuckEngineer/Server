const prisma = require("../lib/prisma")
const findOne = async (params) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        checkouts: true,
      },
    });
    if (!user) {
      throw { name: "UserNotFound" }
    }

    return user;
  } catch (error) {
    throw error
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
    throw error
  }
};

const destroy = async (params) => {
  const { user_id, id } = params;
  try {
    const findId = await prisma.user.findUnique({
      where: { user_id, id: Number(id) },
    });
    if (!findId) {
      throw { name: "UserNotFound" };
    }
    const deleteUser = await prisma.user.delete({
      where: { user_id, id: Number(id) },
    });
    if (!deleteUser) {
      throw { name: "FailedToDeleteUser" };
    }

    return deleteUser;
  } catch (error) {
    throw error
  }
};

module.exports = { findOne, update, destroy };
