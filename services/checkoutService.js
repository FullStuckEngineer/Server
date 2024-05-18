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
            data: {
                user_id: Number(user_id),
                address_id: body.address_id,
                courier_id: body.courier_id,
                bank: body.bank,
                shipping_method: body.shipping_method,
                shipping_note: body.shipping_note,
                total_cost: body.total_cost,
                shipping_cost: body.shipping_cost,
                net_price: body.net_price,
                payment_method: body.payment_method,
                checkout_products,
            } 
        });

       //use loop for check checkout_product
       //product_id
       //quantity
       //price
       //reduce stock
       //update checkout
       for (let i = 0; i < body.checkout_products_attributes.length; i++) {
        const currentItem = body.checkout_products_attributes[i]

        const foundProduct = await prisma.product.findUnique({
            where: {
                
            }
        })
       }

        return createCheckout
    } catch (error) {
        throw error;
    }
}

const update = async (params) => { }

module.exports = { findAll, findOne, create, update }