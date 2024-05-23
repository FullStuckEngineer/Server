const prisma = require("../lib/prisma");

const findAll = async (params) => {
    const { page = 1, perPage = 10, role = 'User', searchTerms = '', categoryId = '', status = '', sortBy = '' } = params;

    console.log("page ", page);
    console.log("perPage ", perPage);
    console.log("role ", role);
    console.log("searchTerms ", searchTerms);
    console.log("categoryId ", categoryId);
    console.log("status ", status);
    console.log("sortBy ", sortBy);

    const offset = (page - 1) * perPage;
    const limit = perPage;

    let where = {};
    if (role === 'User') {
        where.status = 'Active';
    } else {
        if (status) {
            where.status = status;
        }
    }

    if (categoryId) {
        where.category_id = parseInt(categoryId);
    }

    if (searchTerms) {
        const searchConditions = [
            { name: { contains: searchTerms, mode: 'insensitive' } },
            { sku: { contains: searchTerms, mode: 'insensitive' } },
            { slug: { contains: searchTerms, mode: 'insensitive' } },
            // { status: { contains: searchTerms, mode: 'insensitive' } }
        ];
        
        if (!isNaN(parseInt(searchTerms))) {
            searchConditions.push({ price: { equals: parseInt(searchTerms) } });
            searchConditions.push({ weight: { equals: parseInt(searchTerms) } });
            searchConditions.push({ category_id: { equals: parseInt(searchTerms) } });
            searchConditions.push({ stock: { equals: parseInt(searchTerms) } });
        }
        
        where.OR = searchConditions;
    }

    console.log("WHERE ", where);

    const totalCount = await prisma.product.count({ where });

    const orderBy = sortBy ? { [sortBy]: 'asc' } : undefined;

    const products = await prisma.product.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy,
    });

    console.log("PRODUCTS ", products);

    if (!products.length) throw { name: "ErrorNotFound", message: "Products Not Found" };

    const totalPages = Math.ceil(totalCount / perPage);
    return { products, totalPages };
}

const findOne = async (params) => {
    const { slug, role } = params;

    let where = { slug };
    if (role === 'User') {
        where.status = 'Active';
    }

    const foundProduct = await prisma.product.findFirst({
        where,
    });

    if (!foundProduct) {
        throw { name: "Product Not Found" };
    }

    return foundProduct;
}

const generateSlug = (name) => {
    const slugifiedName = name.toLowerCase().replace(/\s+/g, '-');
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const slug = `${slugifiedName}-${randomNumber}`;
    return slug;
}

const create = async (params) => {
    const { name, description, price, weight, category_id, stock, sku, keywords } = params;

    const description_encoded = new TextEncoder().encode(description);

    if (stock < 0 || price < 0 || weight < 0) {
        throw { name: "MustPositive", message: "Stock, price, and weight cannot be negative" };
    }

    const slug = generateSlug(name);

    const category = await prisma.category.findFirst({
        where: {
            id: parseInt(category_id),
            status: 'Active'
        }
    });

    if (!category) {
        throw { name: "CategoriesNotFound" };
        throw { name: "ErrorNotFound", message: "Category Not Found or Inactive" };
    }

    const product = await prisma.product.create({
        data: {
            name,
            description: description_encoded,
            price: parseInt(price),
            weight: parseFloat(weight),
            category_id: parseInt(category_id),
            stock: parseInt(stock),
            sku,
            slug,
            keywords,
            created_at: new Date(),
            update_at: new Date()
        }
    })
    if (!product){
        throw ({ name: "ErrorCreate", message: "Failed to Create Product" })
    }

    return product;
}

const uploadImage = async (params) => {
    const { productId, filePath } = params;

    const product = await prisma.product.update({
        where: {
            id: parseInt(productId)
        },
        data: {
            photo: filePath,
            update_at: new Date()
        }
    });
    if (!product) throw { name: "ErrorUpload", message: "Failed to Upload Image" };

    return product;
}

const update = async (params) => {
    try {
        await prisma.$transaction(async (prisma) => {
            const { id, name, description, price, weight, category_id, stock, sku, keywords, shopping_items, checkout_products } = params;

            if ((stock && stock < 0) || (price && price < 0) || (weight && weight < 0)) {
                throw { name: "MustPositive", message: "Stock, price, and weight cannot be negative" };
            }

            if (category_id) {
                const category = await prisma.category.findFirst({
                    where: {
                        id: parseInt(category_id),
                        status: 'Active'
                    }
                });

                if (!category) {
                    throw { name: "ErrorNotFound", message: "Category Not Found or Inactive" };
                }
            }

            // If stock < shopping_items.quantity, destroy shopping item
            if (shopping_items) {
                for (let i = 0; i < shopping_items.length; i++) {
                    const shopping_item = shopping_items[i];
                    if (shopping_item.quantity > stock) {
                        // Set Shopping Item Quantity to 0
                        shopping_item.quantity = 0;

                        // Destroy Shopping Item
                        const destroyedShoppingItem = await prisma.shoppingItem.delete({
                            where: {
                                id: shopping_item.id
                            }
                        });
                        if (!destroyedShoppingItem) throw ({ name: "ErrorUpdate", message: "Failed to Update ShoppingItem" })
                    }
                }
            }

            if (name) {
                slug = generateSlug(name);
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
                update_at: new Date()
            };

            const product = await prisma.product.update({
                where: {
                    id
                },
                data: dataToUpdate
            });
            if (!product) throw ({ name: "ErrorUpdate", message: "Failed to Update Product" })

            return product;
        });
    } catch (error) {
        throw ({ name: "ErrorUpdate", message: "Failed to Update Product" })
    }
}

const destroy = async (params) => {
    try {
        await prisma.$transaction(async (prisma) => {
            const productId = parseInt(params.id);

            // Destroy product in shopping_items
            const shopping_items = await prisma.shoppingItem.deleteMany({
                where: {
                    product_id: productId
                }
            });
        
            if (!shopping_items) throw ({ name: "ErrorDelete", message: "Failed to Delete Shopping Item" })
        
            const product = await prisma.product.update({
                where: {
                    id: parseInt(productId)
                },
                data: {
                    stock: 0,
                    status: "Inactive"
                }
            })
            if (!product) hrow ({ name: "ErrorDelete", message: "Failed to Update Product" })
        
            return product;
        });
    } catch (error) {
        throw ({ name: "ErrorDelete", message: "Failed to Delete Product" })
    }
}

module.exports = { findAll, findOne, create, update, destroy, uploadImage }
