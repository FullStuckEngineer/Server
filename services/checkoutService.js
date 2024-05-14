const prisma = require("../lib/prisma")

const findAll = async (params) => {
    // Filter for findAll
    //  filter by courier
    //  filter by order id
    //  filter by user
    try {
        const id = Number(params.id)

        //check user
        const getById = await prisma.checkout.findMany({
            where: {
                user_id: id
            },
            include: {
                address: true, courier: true, checkout_products: true
            }
        })

        if (!getById) {
            throw ({ name: "ErrorNotFound", message: "Checkout List Not Found" })
        }

        return getById
    } catch (error) {
        throw error
    }
}

const findOne = async (params) => { }

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
    // - pagination
    // - filter
    // - Checkout Product?
    try {
        const { user_id, body } = params

        //get courier_id, total_cost, total_weight, shipping_cost from cart
        // const cart = await prisma.cart.findUnique({
        //     where: {
        //         user_id: Number(user_id)
        //     },
        //     select: {
        //         courier_id: true,
        //         total_cost: true,
        //         total_weight: true,
        //         shiping_cost: true,
        //         shopping_items: {
        //             select: {
        //                 product_id: true,
        //                 quantity: true
        //             }
        //         }
        //     },
        // })
        // set default courier_id to 1
        // if (cart.courier_id === null) {
        //     await prisma.cart.update({
        //         where: {
        //             user_id: Number(user_id)
        //         },
        //         data: {
        //             courier_id: 1
        //         }
        //     })
        // }

        // check stock product
        // cart.shopping_items.forEach(async (item) => {
        //     try {
        //         const product = await prisma.product.findUnique({
        //             where: {
        //                 id: item.product_id
        //             }
        //         })
        //         if (product.stock < item.quantity) {
        //             throw ({ name: "ErrorNotEnoughStock", message: "Not enough stock" })
        //         }

        //         // update stock
        //         await prisma.product.update({
        //             where: {
        //                 id: item.product_id
        //             },
        //             data: {
        //                 stock: product.stock - item.quantity
        //             }
        //         })
        //     } catch (error) {
        //         throw error
        //     }
        // })

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

        if(!courier) { throw ({ name: "ErrorNotFound", message: "Courier Not Found" }) }

       

        const createCheckout = await prisma.checkout.create({
            data: body
                //address?
                //payment_method?
                //bank?
                //payment_receipt?
                //STATUS: default waiting payment
                //invoice (auto generate)
                //midtrans_data?
                //shipping_note?
                //shipping_cost?
                //shipping_method?
                //checkout_products?
        });
        console.log(cart)
        return createCheckout
    } catch (error) {
        throw error;
    }
}

const update = async (params) => { }

module.exports = { findAll, findOne, create, update }