const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt")


const register = async (params) => {
  const { name, email, password, role = "user" } = params;

  const newPassword = hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: newPassword,
      role: role,
    },
  });

  const cart = await prisma.cart.create({
    data: {
      user_id: user.id,
    },
  });
  return user;
};

const login = async (params) => {
  const { email, password } = params;

  const foundUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!foundUser) throw { name: "InvalidCredentials" };

  if (comparePassword(password, foundUser.password)) {
    const accessToken = generateToken({
        id: foundUser.id,
        email: foundUser.email
    })
    return accessToken
  } else {
    throw { name: "InvalidCredentials" };
  }
};

module.exports = { login, register };
