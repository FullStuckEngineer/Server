const prisma = require("../lib/prisma");

const findAll = async (params) => {
    const products = await prisma.product.findMany();
    if (!products) throw { name: "Products Not Found" };
    return products;
} 

const findOne = async (params) => {
    const productId = parseInt(params.id);
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });
    if (!product) throw { name: "Product Not Found" };
    return product;
} 

const create = async (params) => {
    const { name, description, price, weight, category_id, stock, sku, slug, keywords } = params;
    const product = await prisma.product.create({
        data: {
            name,
            description,
            price : parseInt(price),
            weight : parseFloat(weight),
            category_id : parseInt(category_id),
            stock : parseInt(stock),
            sku,
            slug,
            keywords,
            shopping_items: [],
            checkout_products: [],
            created_at: new Date(),
            update_at: new Date()
        }
    })
    if (!product) throw { name: "Failed to Create Product" };

    return product;
} 

const uploadImage = async (params) => {
    const { productId, filePath } = params;
    const product = await prisma.product.update({
        where: {
            id: productId
        },
        data: {
            photo: filePath,
            updated_at: new Date()
        }
    });
    if (!product) throw { name: "Failed to Upload Image" };

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
    if (!product) throw { name: "Failed to Update Image" };

    return product;
}

const destroy = async (params) => {
    const { id } = params;
    const product = await prisma.product.delete({
        where: {
            id
        }
    })
    if (!product) throw { name: "Failed to Delete Image" };

    return product;
} 

module.exports = { findAll, findOne, create, update, destroy, uploadImage }