const prisma = require("../lib/prisma");
const axios = require('axios');
require("dotenv").config();

const findOne = async (params) => {
    try {
        console.log("PARAMS", params);
        const id = Number(params.id);
        const logged_user_id = params.logged_user_id;

        // Check if user_id in cart_id and logged_user_id are the same
        // and display shopping_item based on user cart
        const cart = await prisma.cart.findUnique({
            where: { user_id: logged_user_id }, 
            include: { shopping_items: true }
        });

        if (logged_user_id !== cart.user_id) {
            throw ({ name: "ErrorUnauthorized", message: "Unauthorized" })
        }

        return cart
    } catch (error) {
        throw ({ name: "ErrorFetch", message: "Error Fetching Carts" })
    }
}


const update = async (params) => {
    try {
        await prisma.$transaction(async (prisma) => {
            const { user_id, id, body } = params

            const { address_id: paramAddressId, courier_id: paramCourierId, shipping_method: paramShippingMethod, shopping_items: paramShoppingItem } = body;

            if (!id) throw ({ name: "ErrorRequired", message: "Cart ID is required" });

            // Get current cart data
            let currentCart = await prisma.cart.findUnique({
                where: { user_id: Number(user_id) },
                select: { id: true, user_id: true, address_id: true, courier_id: true, shipping_method: true, shopping_items: true }
            });

            let total_weight = 0;
            let shipping_cost = 0;
            let total_cost = 0;
            let net_price = 0;
            let address_id = currentCart.address_id ? currentCart.address_id : null;
            let courier_id = currentCart.courier_id ? currentCart.courier_id : null;
            let shipping_method = currentCart.shipping_method ? currentCart.shipping_method : null;
            let shopping_items = [];
            
            if (paramAddressId !== undefined) {
                address_id = paramAddressId;
            }
            if (paramCourierId !== undefined) {
                courier_id = paramCourierId;
            }
            if (paramShippingMethod !== undefined) {
                shipping_method = paramShippingMethod;
            }
            if (paramShoppingItem !== undefined) {
                shopping_items = paramShoppingItem;
            }

            if (user_id !== undefined) {
                // Check if user_id and logged_user_id are the same
                let user_id_cart = await prisma.cart.findUnique({
                    where: { user_id: Number(user_id) },

                });
                user_id_cart = user_id_cart.user_id;
                if (user_id !== user_id_cart) {
                    throw ({ name: "ErrorUnauthorized", message: "Unauthorized" })
                }
            }

            // Check if user_id from address_id and logged_user_id are the same
            if (paramAddressId !== undefined) {
                let address_id_cart = await prisma.address.findUnique({
                    where: { id: Number(address_id) },
                    select: { user_id: true }
                });

                address_id_cart = address_id_cart.user_id;
                if (user_id !== address_id_cart) {
                    throw ({ name: "ErrorUnauthorized", message: "Unauthorized" })
                }
            }

            // Check if courier_id exist
            if (paramCourierId !== undefined) {
                const courier = await prisma.courier.findUnique({
                    where: { id: Number(courier_id) }
                });
                if (!courier) {
                    throw ({ name: "ErrorNotFound", message: "Courier Not Found" })
                }
            }

            // Check if product in shopping_items exist and stock is enough
            for (let i = 0; i < shopping_items.length; i++) {
                const shopping_item = shopping_items[i];
                const product = await prisma.product.findUnique({
                    where: { id: shopping_item.product_id }
                });
                if (!product) {
                    throw ({ name: "ErrorNotFound", message: "Product Not Found" })
                }
                if (product.stock < shopping_item.quantity) {
                    throw ({ name: "StockNotEnough", message: "Stock is not enough" })
                }
            }

            // Get current shopping_items
            let currentShoppingItemsCart = await prisma.cart.findUnique({
                where: { user_id: Number(user_id) },
                select: { shopping_items: true }
            });

            currentShoppingItemsCart = currentShoppingItemsCart.shopping_items;

            // List of current shopping_items id
            let currentShoppingItemProducts = [];
            if (currentShoppingItemsCart.length > 0) {
                currentShoppingItemProducts = currentShoppingItemsCart.map(item => item.product_id);
            }

            // Proceed to update shopping_items
            for (let i = 0; i < shopping_items.length; i++) {
                const shopping_item = shopping_items[i];
                if (currentShoppingItemProducts.length == 0 || !currentShoppingItemProducts.includes(shopping_item.product_id)) {
                    // If shopping_item not in current shopping_items
                    if (shopping_item.quantity > 0) {
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
                                price: product.price,
                                weight: product.weight,
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
                            where: { id: Number(id) },
                            data: { shopping_items: { connect: { id: shopping_item_id.id } } }
                        })
                    }
                    // else if shopping_item.quantity = 0, then ignore it
                } else {
                    // If shopping_item in current shopping_items
                    if (shopping_item.quantity > 0) {
                        // Check if shopping_item.quantity > 0, then update shopping_item

                        // Find shopping item_id by product_id
                        let shopping_item_id = await prisma.shoppingItem.findFirst({
                            where: {
                                cart_id: currentCart.id,
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
                                price: product.price,
                                weight: product.weight,
                            }
                        })
                    } else {
                        // else if shopping_item.quantity = 0, then remove shopping_item
                        // Find shopping item_id by product_id
                        let shopping_item_id = await prisma.shoppingItem.findFirst({
                            where: {
                                cart_id: currentCart.id,
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
                where: { user_id: Number(user_id) },
                select: { shopping_items: true }
            });
            updatedShoppingItems = updatedShoppingItems.shopping_items;

            if (updatedShoppingItems.length > 0) {
                // Calculate total weight = weight * quantity of shopping_items
                total_weight = updatedShoppingItems.reduce((sumWeight, item) => sumWeight + (item.weight * item.quantity), 0);

                // Calculate total cost = total (price * quantity) of shopping_items
                total_cost = updatedShoppingItems.reduce((sumPrice, item) => sumPrice + (item.price * item.quantity), 0);

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
                const shipping_cost_params = { city_id, total_weight, courier_name, shipping_method }
                if (total_weight > 0) {
                    shipping_cost = await getShippingCost(shipping_cost_params);
                }

                // Calculate net price = total cost + shipping cost
                net_price = total_cost + shipping_cost;
            } else {
                address_id = null;
                courier_id = null;
                shipping_method = null;
                shipping_cost = null;
                total_weight = null;
                total_cost = null;
                net_price = null;
            }

            // Find Created At
            let created_at = await prisma.cart.findUnique({
                where: { user_id: Number(user_id) },
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
                net_price: net_price,
                update_at: new Date(),
                created_at: created_at
            };

            const updateCart = await prisma.cart.update({
                where: {
                    id: Number(id)
                },
                data: dataToUpdate
            })
            if (!updateCart) {
                throw ({ name: "ErrorUpdate", message: "Failed to Update Cart" });
            }

            return updateCart;
        });
    } catch (error) {
        throw ({ name: "ErrorUpdate", message: "Failed to Update Cart" });
    }
}

const destroy = async (params) => {
    try {
        const { user_id, idShoppingItem } = params;
        
        // Get cart by user_id
        const cart = await prisma.cart.findUnique({
            where: {
                user_id: Number(user_id)
            }
        });

        if (!cart) {
            throw ({ name: "ErrorNotFound", message: "Cart Not Found" });
        }

        // Get cart's shopping item
        const cartShoppingItems = await prisma.shoppingItem.findMany({
            where: {
                cart_id: cart.id
            }
        });

        // Check if idShoppingItem is in cart's shopping item
        const shoppingItem = cartShoppingItems.find(item => item.id === Number(idShoppingItem));
        if (!shoppingItem) {
            throw ({ name: "ErrorNotFound", message: "Shopping Item Not Found" });
        }

        // Set shopping item quantity to 0
        shoppingItem.quantity = 0;

        // Prepare the update parameters
        const updateParams = {
            user_id: Number(user_id),
            id: cart.id,
            body: { // Wrap shopping items inside body
                shopping_items: [shoppingItem]
            }
        };

        // Call the update function
        const updatedCart = await update(updateParams);

        return updatedCart;
    } catch (error) {
        throw { name: "ErrorDelete", message: "Failed to Delete Shopping Item in Cart"};
    }
};

const getShippingCost = async (params) => {
    try {
        const { city_id, total_weight, courier_name, shipping_method } = params;

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

        // Get all shipping method
        const courier_shipping_methods = response.data.rajaongkir.results[0].costs.map(cost => cost.service);
        console.log('Courier Shipping Methods:', courier_shipping_methods);
        console.log('Shipping Method:', shipping_method);

        // Check if shipping method is available
        if (!courier_shipping_methods.includes(shipping_method)) {
            throw ({ name: "ErrorNotFound", message: "Shipping Method Not Found" })
        } else {
            // Get shipping cost based on shipping method
            const shipping_cost = response.data.rajaongkir.results[0].costs.find(cost => cost.service == shipping_method);
            return shipping_cost.cost[0].value;
        }
    } catch (error) {
        console.error('Error fetching shipping cost:', error.message);
        throw ({ name: "ErrorFetch", message: "Error Fetching Shipping Cost" });
    }
};

module.exports = { findOne, getShippingCost, update, destroy }
