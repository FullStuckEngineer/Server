const prisma = require("../lib/prisma")

const findOne = async (params) => {
    try {
        const id = Number(params.id)

        const getById = await prisma.cart.findUnique({
            where: {
                user_id: id
            },
            include: {
                shopping_items: {
                    include: {
                        product: true
                    }
                }
            }
        })
        if (!getById) {
            throw ({
                name: "ErrorNotFound",
                message: "Cart Not Found"
            })
        }

        
        let totalPrice = 0
        let totalWeight = 0

        for (const item of getById.shopping_items) {
            const product = await prisma.product.findUnique({
                where: {
                    id: item.product_id
                }
            })

            await prisma.shoppingItem.update({
                where: {
                    id: item.id
                }, data: {
                    price: product.price
                }
            })

            totalPrice += product.price * item.quantity
            totalWeight += product.weight * item.quantity
        }

        const cart = await prisma.cart.update({
            where: { id: getById.id },
            data: {
                total_cost: totalPrice, total_weight: totalWeight
            },
            include: {
                shopping_items: {
                    include: {
                        product: { select: { weight: true } }
                    }
                }
            }
        })

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
    try {
        // buat operasi pengurangan harga untuk setiap shopping_item dengan total_cost untuk setiap penghapusan shopping_item
        // buat operasi pengurangan weight untuk setiap shopping_item dengan total_weight untuk setiap penghapusan shopping_item
        const { id, idShoppingItem } = params

        const shoppingItems = await prisma.shoppingItem.findUnique({
            where: {
                id: Number(idShoppingItem)
            }, include: {
                cart: {
                    select: {
                        user_id: true, total_cost: true, total_weight: true
                    }
                }, product: true
            }
        })

        if (!shoppingItems) {
            throw ({
                name: "ErrorNotFound",
                message: "Shopping Item Not Found"
            })
        }

        if (shoppingItems.cart.user_id !== Number(id)) {
            throw { name: "NotPermitted" }
        }

        const totalPrice = shoppingItems.price * shoppingItems.quantity
        const fixPrice = shoppingItems.cart.total_cost - totalPrice
        const totalWeight = shoppingItems.product.weight * shoppingItems.quantity
        const fixWeight = shoppingItems.cart.total_weight - totalWeight
        console.log(fixPrice)
        console.log(fixWeight)

        await prisma.cart.update({
            where: {
                user_id: Number(id)
            }, data: {
                total_cost: fixPrice,
                total_weight: fixWeight
            }
        })

        const delShoppingItem = await prisma.shoppingItem.delete({
            where: {
                id: Number(idShoppingItem)
            }
        })

        return delShoppingItem
    } catch (error) {
        throw error
    }
}



module.exports = { findOne, update, destroy }