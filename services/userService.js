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
      throw new ErrorNotFound("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
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
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const destroy = async (params) => {
  const { user_id, id } = params;
  try {
    const findId = await prisma.user.findUnique({
      where: { user_id, id: Number(id) },
    });
    if (!findId) {
      throw { name: "ErrorNotFound" };
    }
    const deleteUser = await prisma.user.delete({
      where: { user_id, id: Number(id) },
    });
    return deleteUser;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

module.exports = { findOne, update, destroy };
