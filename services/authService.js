const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt")


const register = async (params) => {

  const { name, email, password, role = "user" } = params;

  if (password.length <= 6) {
    console.log(password.length)
    throw { name: "PasswordTooShort" }
  } else {
    const checkEmail = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: name },
        ]
      }
    })

    if (checkEmail) {
      if (checkEmail.email === email) {
        throw { name: "EmailAlreadyTaken" }
      } else if (checkEmail.name === name) {
        throw { name: "NameAlreadyTaken" }
      }
    }


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
  }
};

const login = async (params) => {
  const { email, password } = params;

  const foundUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!foundUser) throw { name: "InvalidEmailOrPassword" };

  if (comparePassword(password, foundUser.password)) {
    const accessToken = generateToken({
      id: foundUser.id,
      email: foundUser.email
    })
    return accessToken
  } else {
    throw { name: "InvalidEmailOrPassword" };
  }
};

module.exports = { login, register };