const prisma = require("../lib/prisma")

const findOne = async (params) => {
    try {
        const id = Number(params.id)

        //cart
        const getById = await prisma.cart.findUnique({
            where: {
                user_id: id
            },
            include: {
                shopping_items: true
            }
        })
        if (!getById) {
            throw ({
                name: "ErrorNotFound",
                message: "Cart Not Found"
            })
        }
        
        //shopping_items
        const shoppingItems = getById.shopping_items

        //total
        let totalPrice = 0
        for(let x = 0; x < shoppingItems.length; x++){
           const currentItem = shoppingItems[x]
           const price = currentItem.price
           const quantity = currentItem.quantity
           totalPrice += price * quantity
        }
        console.log(totalPrice)
        const cart = await prisma.cart.update({
            where: { id: getById.id},
            data: { total_cost: totalPrice},
            include: { shopping_items: true }
        })
        console.log(cart)
     
        return cart
    } catch (error) {
        throw error
    }
}

const update = async (params) => {
    try {
        // Update shopping_items
        // Check courier exist?
        // Check address exist?
        // Update total price
        // Update Net Price = total Price + shipping_cost
        const { id, body } = params
        const updateCart = await prisma.cart.update({
            where: { id: Number(id) },
            data: body
        })
        return updateCart
    } catch (error) {
        throw error
    }
}

const destroy = async (params) => {
    const id = Number(params.id)
    try {
        if (!id) {
            throw ({ name: "ErrorNotFound", message: "Cart Not Found" })
        } else {
            const deleteCart = await prisma.cart.delete({
                where: { id }
            })
            return deleteCart
        }
    } catch (error) {
        throw error
    }
}

module.exports = { findOne, update, destroy }