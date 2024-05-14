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
            const { id, address_id: paramAddressId, courier_id: paramCourierId, shipping_method: paramShippingMethod, shopping_items, logged_user_id } = params;

            let total_weight = 0;
            let shipping_cost = 0;
            let total_cost = 0;
            let address_id = null;
            let courier_id = null;
            let shipping_method = null;

            if (paramAddressId !== undefined) {
                address_id = paramAddressId;
            }
            if (paramCourierId !== undefined) {
                courier_id = paramCourierId;
            }
            if (paramShippingMethod !== undefined) {
                shipping_method = paramShippingMethod;
            }
            
            // Check if user_id and logged_user_id are the same
            let user_id_cart = await prisma.cart.findUnique({
                where: { id: Number(id) },
                select: { user_id: true }
            });
            user_id_cart = user_id_cart.user_id;

            if (logged_user_id !== user_id_cart) {
                throw ({ name: "ErrorUnauthorized", message: "Unauthorized" })
            }

            // Check if user_id from address_id and logged_user_id are the same
            let address_id_cart = await prisma.address.findUnique({
                where: { id: Number(address_id) },
                select: { user_id: true }
            });

            address_id_cart = address_id_cart.user_id;

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

            // Get current shopping_items
            let currentShoppingItemsCart = await prisma.cart.findUnique({ 
                where: { id: Number(id) },
                select: { shopping_items: true }
            });

            currentShoppingItemsCart = currentShoppingItemsCart.shopping_items;

            // List of current shopping_items id
            let currentShoppingItemProducts = [];
            if (currentShoppingItemsCart.length > 0) {
                currentShoppingItemProducts = currentShoppingItemsCart.map(item => item.product_id);
            }

            // Proceed to update shopping_items
            for(let i = 0; i < shopping_items.length; i++) {
                const shopping_item = shopping_items[i];
                if (currentShoppingItemProducts.length == 0 || !currentShoppingItemProducts.includes(shopping_item.product_id)) {
                    // If shopping_item not in current shopping_items
                    if(shopping_item.quantity > 0) {
                        // Check if shopping_item.quantity > 0, then add to current shopping_items

                        // Get product detail
                        const product = await prisma.product.findUnique({
                            where: { id: shopping_item.product_id }
                        });

                        await prisma.shoppingItem.create({
                            data: {
                                cart_id: Number(id),
                                product_id: shopping_item.product_id,
                                quantity: shopping_item.quantity,
                                price: product.price * shopping_item.quantity,
                                weight: product.weight * shopping_item.quantity
                            }
                        });
                        
                        const shopping_item_id = await prisma.shoppingItem.findFirst({
                            where: {
                                cart_id: Number(id),
                                product_id: shopping_item.product_id
                            },
                            select: { id: true }
                        });

                        await prisma.cart.update({
                            where: { id: id },
                            data: { shopping_items: { connect: { id: shopping_item_id.id } } }
                        })
                    }
                    // else if shopping_item.quantity = 0, then ignore it
                } else {
                    // If shopping_item in current shopping_items
                    if(shopping_item.quantity > 0) {
                        // Check if shopping_item.quantity > 0, then update shopping_item

                        // Find shopping item_id by product_id
                        let shopping_item_id = await prisma.shoppingItem.findFirst({
                            where: {
                                cart_id: Number(id),
                                product_id: shopping_item.product_id
                            },
                            select: { id: true }
                        });
                        shopping_item_id = shopping_item_id.id;

                        // Get product detail
                        const product = await prisma.product.findUnique({
                            where: { id: shopping_item.product_id }
                        });

                        await prisma.shoppingItem.update({
                            where: { id: shopping_item_id },
                            data: { 
                                quantity: shopping_item.quantity,
                                price: product.price * shopping_item.quantity,
                                weight: product.weight * shopping_item.quantity
                            }
                        })
                    } else {
                        // else if shopping_item.quantity = 0, then remove shopping_item
                        // Find shopping item_id by product_id
                        let shopping_item_id = await prisma.shoppingItem.findFirst({
                            where: {
                                cart_id: Number(id),
                                product_id: shopping_item.product_id
                            },
                            select: { id: true }
                        });
                        shopping_item_id = shopping_item_id.id;

                        await prisma.shoppingItem.delete({
                            where: {
                                id: shopping_item_id
                            }
                        })
                    }
                }
            }       
            
            // Get updated shopping_items
            let updatedShoppingItems = await prisma.cart.findUnique({
                where: { id: Number(id) },
                select: { shopping_items: true }
            });
            updatedShoppingItems = updatedShoppingItems.shopping_items;        

            if (updatedShoppingItems.length > 0) {
                // Calculate total weight
                const shoppingItemsWeight = updatedShoppingItems.map(item => item.weight);
                total_weight = shoppingItemsWeight.reduce((sumWeight, weight) => sumWeight + weight, 0);
                // Get destination city_id
                let city_id = await prisma.address.findUnique({
                    where: { id: Number(address_id) },
                    select: { city_id: true }
                });
                city_id = city_id.city_id;

                // Get courier name
                let courier_name = await prisma.courier.findUnique({
                    where: { id: Number(courier_id) },
                    select: { name: true }
                });
                courier_name = courier_name.name            
                // Get Shipping Cost
                const shipping_cost_params = {city_id, total_weight, courier_name}
                if (total_weight > 0) {
                    shipping_cost = await getShippingCost(shipping_cost_params);
                }

                // Get Total Cost = total (price * quantity) of shopping_items + shipping_cost
                total_cost = updatedShoppingItems.reduce((sumPrice, item) => sumPrice + (item.price), 0) + shipping_cost;
            } else {
                address_id = null;
                courier_id = null;
                shipping_method = null;
                shipping_cost = null;
                total_weight = null;
                total_cost = null;
            }

            // Find Created At
            let created_at = await prisma.cart.findUnique({
                where: { id: Number(id) },
                select: { created_at: true }
            });
            created_at = created_at.created_at;
            
            const dataToUpdate = {
                address_id,
                courier_id,
                shipping_method,
                shiping_cost: shipping_cost,
                total_weight: total_weight,
                total_cost: total_cost,
                update_at: new Date(),
                created_at: created_at
            };            

            const updateCart = await prisma.cart.update({
                where: { 
                    id: id 
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
        const {city_id, total_weight, courier_name} = params;

        const response = await axios.post(
            'https://api.rajaongkir.com/starter/cost',
            {
                origin: 501,
                destination: city_id,
                weight: total_weight,
                courier: courier_name
            },
            {
                headers: {
                    key: process.env.RAJAONGKIR_API_KEY,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.rajaongkir.results[0].costs[0].cost[0].value;
    } catch (error) {
        console.error('Error fetching shipping cost:', error.message);
        throw new Error('Failed to fetch shipping cost');
    }
};

module.exports = { findOne, getShippingCost, update, destroy }
