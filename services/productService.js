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

const generateSlug = (name) => {
    const slugifiedName = name.toLowerCase().replace(/\s+/g, '-');
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const slug = `${slugifiedName}-${randomNumber}`;
    return slug;
}

const create = async (params) => {
    const { name, description, price, weight, category_id, stock, sku, keywords } = params;

    if (stock < 0 || price < 0 || weight < 0) {
        throw { name: "Stock, price, and weight cannot be negative" };
    }
    
    const slug = generateSlug(name);

    const category = await prisma.category.findFirst({
        where: {
            id: parseInt(category_id),
            status: 'Active'
        }
    });

    if (!category) {
        throw { name: "Category Not Found or Inactive" };
    }

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
    const { id, name, description, price, weight, category_id, stock, sku, keywords, shopping_items, checkout_products } = params;

    if ((stock && stock < 0) || (price && price < 0) || (wight && weight < 0)) {
        throw { name: "Stock, price, and weight cannot be negative" };
    }

    if (category_id) {
        const category = await prisma.category.findFirst({
            where: {
                id: parseInt(category_id),
                status: 'Active'
            }
        });

        if (!category) {
            throw { name: "Category Not Found or Inactive" };
        }
    }

    if (name) {
        slug = createSlug(name);
    }

    const dataToUpdate = {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(weight && { weight }),
        ...(category_id && { category_id }),
        ...(stock && { stock }),
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
    const productId = parseInt(params.id);
    const product = await prisma.product.update({
        where: {
            id: productId
        },
        data: {
            status: "Inactive"
        }
    })
    if (!product) throw { name: "Failed to Delete Image" };

    return product;
}

module.exports = { findAll, findOne, create, update, destroy, uploadImage }