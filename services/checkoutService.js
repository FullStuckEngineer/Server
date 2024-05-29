const { check } = require("prisma")
const prisma = require("../lib/prisma")
const axios = require("axios")

const findAll = async (params) => {
  try {
    const {
      page = 1,
      perPage = 10,
      role = 'Admin',
      searchTerms = '',
      userId = '',
      courierId = '',
      paymentMethod = '',
      status = '',
      sortBy = '',
    } = params;

    let where = {};

    if (courierId) {
      where.courier_id = parseInt(courierId);
    }
    if (userId) {
      where.user_id = parseInt(userId);
    }
    if (status) {
      where.status = status;
    }
    if (paymentMethod) {
      where.payment_method = paymentMethod;
    }

    if (searchTerms) {
      const searchConditions = [
        { payment_method: { contains: searchTerms, mode: 'insensitive' } },
        { bank: { contains: searchTerms, mode: 'insensitive' } },
        { status: { contains: searchTerms, mode: 'insensitive' } },
      ];

      if (!isNaN(parseInt(searchTerms))) {
        searchConditions.push({ net_price: { equals: parseInt(searchTerms) } });
      }

      where.OR = searchConditions;
    }

    if (role === "User") {
      where.user_id = loggedUser;
    }

    const offset = (page - 1) * perPage;
    const limit = parseInt(perPage);

    const totalCount = await prisma.checkout.count({ where });

    const orderBy = sortBy ? { [sortBy]: 'asc' } : undefined;

    const checkouts = await prisma.checkout.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy,
    });

    if (!checkouts || checkouts.length === 0) {
      throw { name: "ErrorNotFound", message: "Checkout List Not Found" };
    }

    const totalPages = Math.ceil(totalCount / perPage);

    return { checkouts, totalPages };

  } catch (error) {
    if (error.name && error.message) {
        throw error;
    } else {
        throw { name: "ErrorNotFound", message: "Checkouts Not Found" };
    }
  }
};


const findOne = async (params) => {
  try {
    const { id, role, loggedUser } = params

    if (role === "admin") {
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: parseInt(id),
        },
      })

      if (!checkout) {
        throw { name: "ErrorNotFound", message: "Checkout Not Found" }
      }
      return checkout
    } else if (role === "user") {
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: parseInt(id),
        },
      })

      if (!checkout) {
        throw { name: "ErrorNotFound", message: "Checkout Not Found" }
      }

      if (checkout.user_id !== loggedUser) {
        throw { name: "Unauthorized", message: "Unauthorized" }
      }

      return checkout
    } else {
      throw { name: "Unauthorized", message: "Role Not Found" }
    }
  } catch (error) {
    if (error.name && error.message) {
        throw error;
    } else {
        throw { name: "ErrorNotFound", message: "Checkout Not Found" }
    }
  }
}

const create = async (params) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const { user_id, body } = params

      //check address
      const address = await prisma.address.findUnique({
        where: {
          id: Number(body.address_id),
        },
      })

      if (!address) {
        throw { name: "ErrorNotFound", message: "Address Not Found" }
      }

      //check courier
      const courier = await prisma.courier.findUnique({
        where: {
          id: Number(body.courier_id),
        },
      })

      if (!courier) {
        throw { name: "ErrorNotFound", message: "Courier Not Found" }
      }

      const {
        address_id,
        courier_id,
        payment_method,
        bank,
        payment_receipt,
        shipping_method,
        shipping_note,
        shipping_cost,
        total_cost,
        checkout_product_attributes,
      } = body

      let total_cost_calculated = 0
      for (let i = 0; i < checkout_product_attributes.length; i++) {
        const currentItem = checkout_product_attributes[i]
        total_cost_calculated += currentItem.quantity * currentItem.price
      }

      const createCheckout = await prisma.checkout.create({
        data: {
          user_id: Number(user_id),
          address_id,
          courier_id,
          payment_method,
          bank,
          payment_receipt,
          shipping_method,
          shipping_note,
          shipping_cost,
          total_cost: total_cost_calculated,
          net_price: 0,
        },
      })
      if (!createCheckout) {
        throw { name: "ErrorCreate", message: "Failed to Create Checkout" }
      }

      let total_weight = 0
      for (let i = 0; i < checkout_product_attributes.length; i++) {
        const currentItem = checkout_product_attributes[i]

        const product = await prisma.product.findUnique({
          where: {
            id: Number(currentItem.product_id),
          },
        })
        if (!product) {
          throw { name: "ErrorNotFound", message: "Product Not Found" }
        }

        if (product.stock < currentItem.quantity) {
          throw { name: "StockNotEnough", message: "Product Stock Not Enough" }
        }

        if (product.price !== currentItem.price) {
          throw { name: "PriceMismatch", message: "Product Price Mismatch" }
        }

        const checkout_product = await prisma.checkoutProduct.create({
          data: {
            checkout_id: createCheckout.id,
            product_id: currentItem.product_id,
            quantity: currentItem.quantity,
            price: currentItem.price,
          },
        })

        if (!checkout_product) {
          throw {
            name: "ErrorCreate",
            message: "Failed to Create Checkout Product",
          }
        }

        await prisma.product.update({
          where: {
            id: Number(currentItem.product_id),
          },
          data: {
            stock: product.stock - currentItem.quantity,
          },
        })

        total_weight += product.weight * currentItem.quantity
      }

      const checkout = await prisma.checkout.update({
        where: {
          id: createCheckout.id,
        },
        data: {
          total_weight: total_weight,
          net_price: createCheckout.total_cost + createCheckout.shipping_cost,
        },
      })

      return checkout
    })
  } catch (error) {
    if (error.name && error.message) {
        throw error;
    } else {
        throw { name: "ErrorCreate", message: "Failed to Create Checkout" }
    }
  }
}

const pay = async (params) => {
  try {
    const { id, role, loggedUser, bank } = params

    if (role === "user") {
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: +id,
        },
        include: {
          checkout_products: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!checkout) {
        throw { name: "ErrorNotFound", message: "Checkout Not Found" }
      }

      const user_id = checkout.user_id
      if (loggedUser !== user_id) {
        throw { name: "ErrorNotFound", message: "Unauthorized" }
      }

      if (!bank) {
        throw { name: "ErrorNoBank", message: "No Bank Has Selected" }
      }

      await prisma.checkout.update({
        where: {
          id: +id,
        },
        data: {
          bank: bank,
        },
      })

      const post = await axios.post(
        "https://api.sandbox.midtrans.com/v2/charge",
        {
          payment_type: checkout.payment_method,
          transaction_details: {
            order_id: id,
            gross_amount: checkout.net_price,
          },
          bank_transfer: {
            bank: bank,
          },
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: process.env.AUTH_KEY,
          },
        }
      )

      if (+post.data.status_code === 201) {
        return {
          data: post.data.va_numbers,
          message: "expired time " + post.data.expiry_time,
        }
      } else if (+post.data.status_code === 406) {
        return { data: post.data.status_message }
      } else {
        return {
          detail: " There is Something goes Wrong, Please Try Again ",
          data: post.data.status_message,
        }
      }
    }
  } catch (error) {
    throw error
  }
}

const payNotification = async (params) => {
  try {
    const { status_message, order_id, transaction_time, status_code, gross_amount } = params.body

    const statusCode = parseInt(status_code)

    if (!order_id) {
      throw { name: "ErrorNotFound", message: "Order Not Found" }
    }

    if (statusCode === 200) {
      const post = await prisma.checkout.update({
        where: {
          id: +order_id,
        },
        data: {
          status: "payment_verified",
        },
      })

      const response = {
        transaction_time,
        gross_amount,
      }

      await prisma.checkout.update({
        where: {
          id: +order_id,
        },
        data: {
          midtrans_data: response,
        },
      })

      return { message: "Payment Succesfull", name: response }
    } else {
      return {
        message: "There is a problem with your order, please Try Again or contact costumer support. Thank You.",
      }
    }
  } catch (error) {
    throw error
  }
}

const payManual = async (params) => {
  try {
    const loggedUser = params.loggedUser
    const body = params.body
    const checkout = params.params

    if (!checkout) {
      throw { name: "ErrorNotFound", message: "Please Select Your Order" }
    }
    console.log(checkout)
    if (loggedUser) {
      const filename = body.filename
      if (params) {
        const url = `${process.env.BASE_URL}/v1/api/payment_receipt/${filename}`

        const manualPayment = await prisma.checkout.update({
          where: {
            id: +checkout.id,
          },
          data: {
            payment_receipt: url,
          },
        })

        return url
      } else {
        throw { name: "MissingFile" }
      }
    }
  } catch (error) {
    throw error
  }
}

const update = async (params) => {
  try {
    const { id, status, role, loggedUser } = params
    // Check if status is valid
    if (
      status !== "waiting_payment" &&
      status !== "payment_verified" &&
      status !== "processing" &&
      status !== "shipping" &&
      status !== "delivered" &&
      status !== "completed" &&
      status !== "cancelled"
    ) {
      throw { name: "InvalidStatus", message: "Invalid Status" }
    }

    if (role === "admin") {
      const updateCheckout = await prisma.checkout.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status: status,
        },
      })

      if (!updateCheckout) {
        throw { name: "ErrorUpdate", message: "Failed to Update Checkout" }
      }
    } else if (role === "user") {
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: parseInt(id),
        },
      })
      if (checkout.user_id != loggedUser) {
        throw { name: "Unauthorized", message: "Unauthorized" }
      }

      const updateCheckout = await prisma.checkout.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status: status,
        },
      })

      if (!updateCheckout) {
        throw { name: "ErrorUpdate", message: "Failed to Update Checkout" }
      }
    } else {
      throw { name: "Unauthorized", message: "Role Not Found" }
    }
  } catch (error) {
    if (error.name && error.message) {
        throw error;
    } else {
        throw { name: "ErrorUpdate", message: "Failed to Update Checkout" }
    }
  }
}

module.exports = {
  findAll,
  findOne,
  create,
  pay,
  update,
  payNotification,
  payManual,
}
