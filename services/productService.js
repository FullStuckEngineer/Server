const prisma = require("../lib/prisma");

const findAll = async (params) => {
    const products = await prisma.product.findMany()
    return products;
} 

const findOne = async (params) => {
    const productId = parseInt(params.id);
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    return product;
} 

const create = async (params) => {
    const { name, photo, description, price, weight, category_id, stock, sku, slug, keywords } = params;
    const product = await prisma.product.create({
        data: {
            name,
            photo,
            description,
            price,
            weight,
            category_id,
            stock,
            sku,
            slug,
            keywords,
            shopping_items: [],
            checkout_products: [],
            created_at: new Date(),
            update_at: new Date()
        }
    })
    return product;
} 

const uploadImage = async (params) => {
    const { id, photo } = params;
    const product = await prisma.product.update({
        where: {
            id
        },
        data: {
            photo,
            updated_at: new Date()
        }
    });
    return product;
} 

const update = async (params) => {
    const { id, name, photo, description, price, weight, category_id, stock, sku, slug, keywords, shopping_items, checkout_products } = params;
    const dataToUpdate = {
        ...(name && { name }),
        ...(photo && { photo }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(weight !== undefined && { weight }),
        ...(category_id !== undefined && { category_id }),
        ...(stock !== undefined && { stock }),
        ...(sku && { sku }),
        ...(slug && { slug }),
        ...(keywords && { keywords }),
        ...(shopping_items && { shopping_items }),
        ...(checkout_products && { checkout_products }),
        updated_at: new Date()
    };

    const product = await prisma.product.update({
        where: {
            id
        },
        data: dataToUpdate
    });

    return product;
}

const destroy = async (params) => {
    const { id } = params;
    const product = await prisma.product.delete({
        where: {
            id
        }
    })
    return product;
} 

module.exports = { findAll, findOne, create, update, destroy, uploadImage }