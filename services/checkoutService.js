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
        const { body } = params

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


       //use loop for check checkout_product
       //product_id
       //quantity
       //price
       //reduce stock
       //update checkout

        const createCheckout = await prisma.checkout.create({
            data: params
            
        });
        console.log(cart)
        return createCheckout
    } catch (error) {
        throw error;
    }
}

const update = async (params) => { }

module.exports = { findAll, findOne, create, update }