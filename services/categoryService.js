const prisma = require("../lib/prisma");

const findAll = async (params) => {
    const categories = await prisma.category.findMany();
    if (!categories) throw { name: "Categories Not Found" };
    return categories;
} 

const findOne = async (params) => {
    const categoryId = parseInt(params.id);
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    });
    if (!category) throw { name: "Category Not Found" };
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
    if (!category) throw { name: "Failed to Create Category" };
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
    if (!category) throw { name: "Failed to Update Category=" };
    return category;
} 

const destroy = async (params) => {
    const categoryId = parseInt(params.id);
    const category = await prisma.category.delete({
        where: {
            id: categoryId
        }
    })
    if (!category) throw { name: "Failed to Delete Category" };
    return category;
} 

module.exports = { findAll, findOne, create, update, destroy}
