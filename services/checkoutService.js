const prisma = require("../lib/prisma");
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_SECRET,
    clientKey: process.env.NEXT_PUBLIC_CLIENT
})

const findAll = async (params) => {
    // Filter for findAll
    //  filter by courier
    //  filter by order id (??)
    //  filter by user
    try {
        const { courier, order_id, user, role, loggedUser, currentPage = 1, perPage = 10 } = params;

        let where = {};
        if (courier) {
            where.courier = courier
        }
        // if (order_id) {
        //     where.order_id = order_id
        // }
        if (user) {
            where.user = user
        }

        const offset = (currentPage - 1) * perPage;
        const limit = perPage;

        if (role === "admin") {

            const checkout = await prisma.checkout.findMany({
                where,
                skip: offset,
                take: limit
            });

            if (!checkout) {
                throw ({ name: "ErrorNotFound", message: "Checkout List Not Found" })
            };
            return checkout;
        } else if (role === "user") {
            // Show only user's checkout
            where.user_id = loggedUser

            const checkout = await prisma.checkout.findMany({
                where,
                skip: offset,
                take: limit
            });

            if (!checkout) {
                throw ({ name: "ErrorNotFound", message: "Checkout List Not Found" })
            };
            return checkout;
        } else {
            throw ({ name: "ErrorNotFound", message: "Role Not Found" })
        }
    } catch (error) {
        throw ({ name: "ErrorNotFound", message: "Checkouts Not Found" })
    }
}

const findOne = async (params) => { 
    try {
        const { id, role, loggedUser } = params;
        console.log(params);

        if (role === "admin") {
            const checkout = await prisma.checkout.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if (!checkout) {
                throw ({ name: "ErrorNotFound", message: "Checkout Not Found" })
            };
            return checkout;
        } else if (role === "user") {
            // Check if the checkout belongs to the user
            const checkout = await prisma.checkout.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if (!checkout) {
                throw ({ name: "ErrorNotFound", message: "Checkout Not Found" })
            };

            if (checkout.user_id !== loggedUser) {
                throw ({ name: "Unauthorized", message: "Unauthorized" })
            }

            return checkout;
        } else {
            throw ({ name: "Unauthorized", message: "Role Not Found" })
        }
    } catch (error) {   
        throw ({ name: "ErrorNotFound", message: "Checkout Not Found" })
    }
}

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
                    id: Number(body.address_id)
                }
            })

            if (!address) { throw ({ name: "ErrorNotFound", message: "Address Not Found" }) }
            
            //check courier
            const courier = await prisma.courier.findUnique({
                where: {
                    id: Number(body.courier_id)
                }
            })

            if(!courier) { throw ({ name: "ErrorNotFound", message: "Courier Not Found" }) };

            const { address_id, courier_id, payment_method, bank, payment_receipt, shipping_method, shipping_note, shipping_cost, total_cost, checkout_product_attributes } = body;

            // Calculate total cost
            console.log(checkout_product_attributes);
            let total_cost_calculated = 0;
            for (let i = 0; i < checkout_product_attributes.length; i++) {
                const currentItem = checkout_product_attributes[i];
                total_cost_calculated += currentItem.quantity * currentItem.price;
            };

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
                    net_price: 0
                } 
            });
            // console.log(createCheckout)
            if (!createCheckout) { throw ({ name: "ErrorCreate", message: "Failed to Create Checkout" }) }

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
                        id: Number(currentItem.product_id)
                    }
                });
                if (!product) { throw ({ name: "ErrorNotFound", message: "Product Not Found" }) }

                // Check if product stock is enough
                if (product.stock < currentItem.quantity) { throw ({ name: "StockNotEnough", message: "Product Stock Not Enough" }) }

                // Check if product price is correct
                if (product.price !== currentItem.price) { throw ({ name: "PriceMismatch", message: "Product Price Mismatch" }) }

                // Create checkout_product
                const checkout_product = await prisma.checkoutProduct.create({
                    data: {
                        checkout_id: createCheckout.id,
                        product_id: currentItem.product_id,
                        quantity: currentItem.quantity,
                        price: currentItem.price
                    }
                });

                if (!checkout_product) { throw ({ name: "ErrorCreate", message: "Failed to Create Checkout Product" }) }


                // Reduce product stock
                await prisma.product.update({
                    where: {
                        id: Number(currentItem.product_id)
                    },
                    data: {
                        stock: product.stock - currentItem.quantity
                    }
                });

                total_weight += product.weight * currentItem.quantity;
                console.log(total_weight, "<<<< TOTAL WEIGHT")
            }
            console.log("HERE")

            // Update checkout 
            const checkout = await prisma.checkout.update({
                where: {
                    id: createCheckout.id
                },
                data: {
                    total_weight: total_weight,
                    net_price: createCheckout.total_cost + createCheckout.shipping_cost
                }
            });

            return checkout;
        });
    } catch (error) {
        throw ({ name: "ErrorCreate", message: "Failed to Create Checkout" })
    }
}

const pay = async (params) => {
    try {
        const { idCheckout, role, loggedUser } = params;

        //generate random number for id
        let id = ~~(Math.random() * 100) + 1;

        if (role === "user") {
            const checkout = await prisma.checkout.findUnique({
                where: {
                    id: Number(idCheckout)
                }
            });
            if (!checkout) {
                throw ({ name: "ErrorNotFound", message: "Checkout Not Found" })

            }

             if (checkout.user_id !== loggedUser) {
                throw ({ name: "ErrorNotFound", message: "Unauthorized" })
            }

            //take checkout product based on checkout id
            const checkoutProduct = await prisma.checkoutProduct.findMany({
                where: {
                    checkout_id: checkout.id
                }, select: {
                    product_id: true,
                    quantity: true,
                    price: true
                }, include: {
                    product: { select: { name: true } }
                }
            })

            if (!checkoutProduct || checkoutProduct.length === 0) {
                throw ({ name: "ErrorNotFound", message: "Checkout Product Not Found" })
            }

            //prepare item details and calculate gross amount
            let itemDetails = []
            let grossAmount = 0

            checkoutProduct.forEach(product => {
                itemDetails.push({
                    id: id,
                    price: product.price,
                    quantity: product.quantity,
                    name: ` Product ${product.product_id}`
                })
                grossAmount += product.price * product.quantity
            })

            const productName = await prisma.product.findFirst({
                where: {
                    id: checkoutProduct[0].product_id
                }, select : { name: true }
            })

            //send dataCheckout to paymentService
            let parameter = {
                transaction_details: {
                    order_id: `order-${id}`,
                    gross_amount: grossAmount
                },
                item_details: {
                    name: checkoutProduct.product.name,
                    price: checkoutProduct.price,
                    quantity: checkoutProduct.quantity
                }
            }
            
            //create token
            const token = await snap.createTransactionToken(parameter)
            console.log(token)
            return token
        } else {
            throw ({ name: "ErrorNotFound", message: "Unauthorized" })
        }
    } catch (error) {
        throw error
    }
}

const update = async (params) => { 
    try{
        const { id, status, role, loggedUser } = params;
        // Check if status is valid
        if (status !== "waiting_payment" && status !== "payment_verified" && status !== "processing" && status !== "shipping" && status !== "delivered" && status !== "completed" && status !== "cancelled") {
            throw ({ name: "InvalidStatus", message: "Invalid Status" })
        }

        if (role === "admin") {
            console.log(role);

            const updateCheckout = await prisma.checkout.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    status: status
                }
            });

            if (!updateCheckout) {
                throw ({ name: "ErrorUpdate", message: "Failed to Update Checkout" })
            };

        } else if (role === "user") {
            console.log(role);

            const checkout = await prisma.checkout.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            console.log(checkout);
            console.log(loggedUser);
            console.log(checkout.user_id);
            console.log(checkout.user_id != loggedUser);
            if (checkout.user_id != loggedUser) {
                throw ({ name: "Unauthorized", message: "Unauthorized" })
            }

            const updateCheckout = await prisma.checkout.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    status: status
                }
            });

            if (!updateCheckout) {
                throw ({ name: "ErrorUpdate", message: "Failed to Update Checkout" })
            };
        } else {
            throw ({ name: "Unauthorized", message: "Role Not Found" })
        }
    } catch (error) {
        throw ({ name: "ErrorUpdate", message: "Failed to Update Checkout" })
    };
}

module.exports = { findAll, findOne, create, pay, update }