const prisma = require("../lib/prisma");
const axios = require("axios");
const { param } = require("../routes");

const findAll = async (params) => {
  // Filter for findAll
  //  filter by courier
  //  filter by order id (??)
  //  filter by user
  try {
    const {
      courier,
      order_id,
      user,
      role,
      loggedUser,
      currentPage = 1,
      perPage = 10,
    } = params;

    let where = {};
    if (courier) {
      where.courier = courier;
    }
    // if (order_id) {
    //     where.order_id = order_id
    // }
    if (user) {
      where.user = user;
    }

    const offset = (currentPage - 1) * perPage;
    const limit = perPage;

    if (role === "admin") {
      const checkout = await prisma.checkout.findMany({
        where,
        skip: offset,
        take: limit,
      });

      if (!checkout) {
        throw { name: "ErrorNotFound", message: "Checkout List Not Found" };
      }
      return checkout;
    } else if (role === "user") {
      // Show only user's checkout
      where.user_id = loggedUser;

      const checkout = await prisma.checkout.findMany({
        where,
        skip: offset,
        take: limit,
      });

      if (!checkout) {
        throw { name: "ErrorNotFound", message: "Checkout List Not Found" };
      }
      return checkout;
    } else {
      throw { name: "ErrorNotFound", message: "Role Not Found" };
    }
  } catch (error) {
    throw { name: "ErrorNotFound", message: "Checkouts Not Found" };
  }
};

const findOne = async (params) => {
  try {
    const { id, role, loggedUser } = params;
    console.log(params);

    if (role === "admin") {
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!checkout) {
        throw { name: "ErrorNotFound", message: "Checkout Not Found" };
      }
      return checkout;
    } else if (role === "user") {
      // Check if the checkout belongs to the user
      const checkout = await prisma.checkout.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!checkout) {
        throw { name: "ErrorNotFound", message: "Checkout Not Found" };
      }

      if (checkout.user_id !== loggedUser) {
        throw { name: "Unauthorized", message: "Unauthorized" };
      }

      return checkout;
    } else {
      throw { name: "Unauthorized", message: "Role Not Found" };
    }
  } catch (error) {
    throw { name: "ErrorNotFound", message: "Checkout Not Found" };
  }
};

const create = async (params) => {
  //Fitur Checkout
  // - pengecekan courier
  // - pengecekan ongkir
  // - pengecekan address
  // - pengecekan stok
  // - pengurangan stok
  // - pembayaran
  // - payment gateway
  // - update status
  // - validasi field
  // - Checkout Product?

  try {
    await prisma.$transaction(async (prisma) => {
      const { user_id, body } = params;

      //check address
      const address = await prisma.address.findUnique({
        where: {
          id: Number(body.address_id),
        },
      });

      if (!address) {
        throw { name: "ErrorNotFound", message: "Address Not Found" };
      }

      //check courier
      const courier = await prisma.courier.findUnique({
        where: {
          id: Number(body.courier_id),
        },
      });

      if (!courier) {
        throw { name: "ErrorNotFound", message: "Courier Not Found" };
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
      } = body;

      // Calculate total cost
      console.log(checkout_product_attributes);
      let total_cost_calculated = 0;
      for (let i = 0; i < checkout_product_attributes.length; i++) {
        const currentItem = checkout_product_attributes[i];
        total_cost_calculated += currentItem.quantity * currentItem.price;
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
      });
      // console.log(createCheckout)
      if (!createCheckout) {
        throw { name: "ErrorCreate", message: "Failed to Create Checkout" };
      }

      //use loop for check checkout_product
      //product_id
      //quantity
      //price
      //reduce stock
      //update checkout

      let total_weight = 0;
      for (let i = 0; i < checkout_product_attributes.length; i++) {
        const currentItem = checkout_product_attributes[i];

        // Check if product exists
        const product = await prisma.product.findUnique({
          where: {
            id: Number(currentItem.product_id),
          },
        });
        if (!product) {
          throw { name: "ErrorNotFound", message: "Product Not Found" };
        }

        // Check if product stock is enough
        if (product.stock < currentItem.quantity) {
          throw { name: "StockNotEnough", message: "Product Stock Not Enough" };
        }

        // Check if product price is correct
        if (product.price !== currentItem.price) {
          throw { name: "PriceMismatch", message: "Product Price Mismatch" };
        }

        // Create checkout_product
        const checkout_product = await prisma.checkoutProduct.create({
          data: {
            checkout_id: createCheckout.id,
            product_id: currentItem.product_id,
            quantity: currentItem.quantity,
            price: currentItem.price,
          },
        });

        if (!checkout_product) {
          throw {
            name: "ErrorCreate",
            message: "Failed to Create Checkout Product",
          };
        }

        // Reduce product stock
        await prisma.product.update({
          where: {
            id: Number(currentItem.product_id),
          },
          data: {
            stock: product.stock - currentItem.quantity,
          },
        });

        total_weight += product.weight * currentItem.quantity;
        console.log(total_weight, "<<<< TOTAL WEIGHT");
      }
      console.log("HERE");

      // Update checkout
      const checkout = await prisma.checkout.update({
        where: {
          id: createCheckout.id,
        },
        data: {
          total_weight: total_weight,
          net_price: createCheckout.total_cost + createCheckout.shipping_cost,
        },
      });

      return checkout;
    });
  } catch (error) {
    throw { name: "ErrorCreate", message: "Failed to Create Checkout" };
  }
};





const pay = async (params) => {
  try {
  

    const { id, role, loggedUser, bank } = params;

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
      });

     
      if (!checkout) {
        throw { name: "ErrorNotFound", message: "Checkout Not Found" };
      }

    
      const user_id = checkout.user_id;
      if (loggedUser !== user_id) {
        throw { name: "ErrorNotFound", message: "Unauthorized" };
      }

      if (!bank) {
        throw { name: "ErrorNoBank", message: "No Bank Has Selected" };
      }

      await prisma.checkout.update({
        where: {
          id: +id,
        },
        data: {
          bank: bank,
        },
      });


      for(let x = 0; x < checkout.checkout_products.length; x++){
          const currentCheckout = checkout.checkout_products[x]

      const currentPrice = currentCheckout.price
      const curentQuantity = currentCheckout.quantity

          const item_detail = {
                     name: currentCheckout.product.name,
                      price: currentPrice,
                      quantity: curentQuantity
                  }



     const post = await axios
        .post(
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
              Authorization:
                "Basic U0ItTWlkLXNlcnZlci1GaFVjcWdSZld3VVFTZFZXUHdQd0VEV3c6",
            },
          }
        )
        

        if (+post.data.status_code === 201){
           return ({detail:item_detail, data:  post.data.va_numbers ,message:  "expired time " + post.data.expiry_time}) 
        }else if(+post.data.status_code === 406){
          return  ({detail:item_detail, data:   post.data.status_message}) 
        }else{
            return ({detail:" There is Something goes Wrong, Please Try Again ", data:  post.data.status_message})
        }
        

          }       
   
    }
  } catch (error) {
    throw error

  }
};

const update = async (params) => {
  try {
    const { id, status, role, loggedUser } = params;
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
      throw { name: "InvalidStatus", message: "Invalid Status" };
    }

    if (role === "admin") {
      console.log(role);

      const updateCheckout = await prisma.checkout.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status: status,
        },
      });

      if (!updateCheckout) {
        throw { name: "ErrorUpdate", message: "Failed to Update Checkout" };
      }
    } else if (role === "user") {
      console.log(role);

      const checkout = await prisma.checkout.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      console.log(checkout);
      console.log(loggedUser);
      console.log(checkout.user_id);
      console.log(checkout.user_id != loggedUser);
      if (checkout.user_id != loggedUser) {
        throw { name: "Unauthorized", message: "Unauthorized" };
      }

      const updateCheckout = await prisma.checkout.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status: status,
        },
      });

      if (!updateCheckout) {
        throw { name: "ErrorUpdate", message: "Failed to Update Checkout" };
      }
    } else {
      throw { name: "Unauthorized", message: "Role Not Found" };
    }
  } catch (error) {
    throw { name: "ErrorUpdate", message: "Failed to Update Checkout" };
  }
};

const payNotification = async (params) => {
  try {
    const {status_message,order_id,transaction_time, status_code , gross_amount} = params.body

    const statusCode = parseInt(status_code)

    if(!order_id){
      throw { name: "ErrorNotFound", message: "Order Not Found" };
    }

    if(statusCode === 200){
     const post = await prisma.checkout.update({
                where: {
                  id: +order_id
                },
                data:{
                  status: "payment_verified"
                }
              })


              const response = { 
                transaction_time,
                gross_amount,
              }

              return ({message: "Payment Succesfull", name: response})
    }else{
      return ({message: "There is a problem with your order, please Try Again or contact costumer support. Thank You."})
    }


  } catch (error) {
    throw error
  } 
}


module.exports = { findAll, findOne, create, pay, update , payNotification };
