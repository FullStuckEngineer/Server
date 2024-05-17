const prisma = require("../lib/prisma");
const productService = require("./productService");

const findAll = async (params) => {
    const { page = 1, perPage = 10, role = 'User' } = params;

    const offset = (page - 1) * perPage;
    const limit = perPage;

    let where = {};
    if (role === 'User') {
        where.status = 'Active';
    }

    const categories = await prisma.category.findMany({
        where,
        skip: offset,
        take: limit,
    });

    if (!categories) {
        throw { name: "CategoriesNotFound" };
    }

    return categories;
}

const findOne = async (params) => {
    const { id, role } = params;
    const categoryId = parseInt(id);

    let where = { id: categoryId };
    if (role === 'User') {
        where.status = 'Active';
    }

    const category = await prisma.category.findUnique({
        where
    });
    if (!category) throw { name: "CategoriesNotFound" };
    return category;
}

const create = async (params) => {
    const { name } = params;
    const category = await prisma.category.create({
        data: {
            name,
            created_at: new Date(),
            update_at: new Date()
        }
    });
    if (!category) throw { name: "CreatedCategoryFailed" };
    return category;
}

const update = async (params) => {
    const { id, name } = params;
    const category = await prisma.category.update({
        where: {
            id
        },
        data: {
            name,
            update_at: new Date()
        }
    })
    if (!category) throw { name: "UpdateCategoryFailed" };
    return category;
}

const destroy = async (params) => {
    const categoryId = parseInt(params.id);

    // Soft delete product
    const products = await prisma.product.findMany({
        where: {
            category_id: categoryId
        }
    });

    console.log(products);
    if (products.length > 0) {
        for (const product of products) {
            await productService.destroy({ id: product.id });
        }
    }

    // Soft delete category
    const category = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: {
            status: "Inactive"
        }
    })
    if (!category) throw { name: "DeleteCategoryFailed" };
    return category;
}

module.exports = { findAll, findOne, create, update, destroy }