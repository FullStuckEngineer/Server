const prisma = require("../lib/prisma");
const axios = require('axios');
require("dotenv").config();

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
        await prisma.$transaction(async (prisma) => {
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
            const city_id = await prisma.address.findUnique({
                where: { id: Number(address_id) },
                select: { city_id: true }
            });

            const courier_name = courier.name;

            const shipping_cost_params = {city_id, total_weight, courier_name}
            const shipping_cost = getShippingCost(shipping_cost_params)

            // TODO : Get Total Cost = total (price * quantity) of shopping_items + shipping_cost
            const total_cost = updatedShoppingItems.reduce((sumPrice, item) => sumPrice + (item.price * item.quantity), 0) + shipping_cost;
            
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

            return updateCart;
        });
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

const getShippingCost = async (params) => {
    try {
        const {city_id, total_weight, courier} = params;
        const response = await axios.post(
            'https://api.rajaongkir.com/starter/cost',
            {
                origin: 501,
                destination: parseInt(city_id),
                weight: parseFloat(total_weight),
                courier: courier
            },
            {
                headers: {
                    key: process.env.RAJAONGKIR_API_KEY,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const shippingCost = response.data.rajaongkir.results[0].costs[0].costs[0].value;
        return shippingCost;
    } catch (error) {
        console.error('Error fetching shipping cost:', error.message);
        throw new Error('Failed to fetch shipping cost');
    }
};

module.exports = { findOne, getShippingCost, update, destroy }
