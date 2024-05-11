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
        const { id, address_id, courier_id, shipping_method, shopping_items, logged_user_id } = params;

        // Check if user_id and logged_user_id are the same
        const user_id_cart = await prisma.cart.findUnique({
            where: { id: Number(id) },
            select: { user_id: true }
        });
        console.log(user_id_cart);
        if (logged_user_id !== user_id_cart) {
            throw ({ name: "ErrorUnauthorized", message: "Unauthorized" })
        }

        // Check if user_id from address_id and logged_user_id are the same
        const address_id_cart = await prisma.address.findUnique({
            where: { id: Number(address_id) },
            select: { user_id: true }
        });
        console.log(address_id_cart);
        if (logged_user_id !== address_id_cart) {
            throw ({ name: "ErrorUnauthorized", message: "Unauthorized" })
        }

        // Check if courier_id exist
        const courier = await prisma.courier.findUnique({
            where: { id: Number(courier_id) }
        });
        if (!courier) {
            throw ({ name: "ErrorNotFound", message: "Courier Not Found" })
        }

        // Check if shopping items exist in ShoppingItem entity
        const shopping_items_exist = await prisma.shoppingItem.findMany({
            where: { id: { in: shopping_items.id } }
        });
        if (shopping_items.length !== shopping_items_exist.length) {
            throw ({ name: "ErrorNotFound", message: "Shopping Item Not Found" })
        }

        // Get current shopping_items
        const currentShoppingItemsCart = await prisma.cart.findUnique({ 
            where: { id: Number(id) },
            select: { shopping_items: true }
        });

        // List of current shopping_items id
        const currentShoppingItemIds = currentShoppingItemsCart.shopping_items.map(item => item.id);

        // Proceed to update shopping_items
        for(let i = 0; i < shopping_items.length; i++) {
            const shopping_item = shopping_items[i];
            if (!currentShoppingItemIds.includes(shopping_item.id)) {
                // If shopping_item not in current shopping_items
                if(shopping_item.quantity > 0) {
                    // Check if shopping_item.quantity > 0, then add to current shopping_items
                    await prisma.cart.update({
                        where: { id: Number(id) },
                        data: { shopping_items: { connect: { id: shopping_item.id } } }
                    })
                }
                // else if shopping_item.quantity = 0, then ignore it
            } else {
                // If shopping_item in current shopping_items
                if(shopping_item.quantity > 0) {
                    // Check if shopping_item.quantity > 0, then update shopping_item
                    await prisma.shoppingItem.update({
                        where: { id: shopping_item.id },
                        data: { quantity: shopping_item.quantity }
                    })
                } else {
                    // else if shopping_item.quantity = 0, then remove shopping_item
                    await prisma.cart.update({
                        where: { id: Number(id) },
                        data: { shopping_items: { disconnect: { id: shopping_item.id } } }
                    })
                }
            }
        }       
        
        // Get updated shopping_items
        const updatedShoppingItems = await prisma.cart.findUnique({
            where: { id: Number(id) },
            select: { shopping_items: true }
        });

        // Get total weight
        const total_weight = updatedShoppingItems.reduce((sumWeight, item) => sumWeight + (item.weight * item.quantity), 0);

        // TODO: Get shipping cost
        // const shipping_cost = getShippingCost(shipping_method, address_id, shopping_items, total_weight);

        // TODO : Get Total Cost = total (price * quantity) of shopping_items + shipping_cost
        const total_cost = updatedShoppingItems.reduce((sumPrice, item) => sumPrice + (item.price * item.quantity), 0);
        
        const dataToUpdate = {
            ...(shipping_cost && { shipping_cost }),
            ...(address_id && { address_id }),
            ...(courier_id && { courier_id }),
            ...(shipping_method && { shipping_method }),
            ...(total_weight && { total_weight }),
            ...(total_cost && { total_cost }),
            ...(updatedShoppingItems && { shopping_items: updatedShoppingItems }),
            updated_at: new Date()
        }

        const updateCart = await prisma.cart.update({
            where: { 
                id: Number(id) 
            },
            data: dataToUpdate
        })
        if (!updateCart) {
            throw ({ name: "ErrorNotFound", message: "Failed to Update Cart" })
        }

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