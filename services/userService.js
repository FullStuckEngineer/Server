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

    return updatedUser;
  } catch (error) {
    throw ({ name: "ErrorUpdate", message: "Failed to Update User" })
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
    return deleteUser;
  } catch (error) {
    throw ({ name: "ErrorDelete", message: "Failed to Delete User" })
  }
};

module.exports = { findOne, update, destroy };
