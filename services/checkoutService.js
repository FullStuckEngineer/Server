const prisma = require("../lib/prisma")

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
        throw error
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

            if (checkout.user_id !== loggedUser) {
                throw ({ name: "ErrorNotFound", message: "Unauthorized" })
            }

            if (!checkout) {
                throw ({ name: "ErrorNotFound", message: "Checkout Not Found" })
            };

            return checkout;
        } else {
            throw ({ name: "ErrorNotFound", message: "Role Not Found" })
        }
    } catch (error) {   
        throw error
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

            if (!createCheckout) { throw ({ name: "ErrorNotFound", message: "Checkout Not Found" }) }

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
                if (product.stock < currentItem.quantity) { throw ({ name: "ErrorNotFound", message: "Product Stock Not Enough" }) }

                // Check if product price is correct
                if (product.price !== currentItem.price) { throw ({ name: "ErrorNotFound", message: "Product Price Mismatch" }) }

                // Create checkout_product
                const checkout_product = await prisma.checkoutProduct.create({
                    data: {
                        checkout_id: createCheckout.id,
                        product_id: currentItem.product_id,
                        quantity: currentItem.quantity,
                        price: currentItem.price
                    }
                });

                if (!checkout_product) { throw ({ name: "ErrorNotFound", message: "Checkout Product Not Found" }) }

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
            }

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
        throw error;
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
                throw ({ name: "ErrorNotFound", message: "Checkout Not Found" })
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
                throw ({ name: "ErrorNotFound", message: "Unauthorized" })
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
                throw ({ name: "ErrorNotFound", message: "Checkout Not Found" })
            };
        } else {
            throw ({ name: "ErrorNotFound", message: "Role Not Found" })
        }
    } catch (error) {
        throw error
    };
}

module.exports = { findAll, findOne, create, update }