const prisma = require("../lib/prisma");

const findAll = async (params) => {
    const categories = await prisma.category.findMany()
    return categories;
} 

const findOne = async (params) => {
    const categoryId = parseInt(params.id);
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })
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
    })
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
    return category;
} 

const destroy = async (params) => {
    const categoryId = parseInt(params.id);
    const category = await prisma.category.delete({
        where: {
            id: categoryId
        }
    })
    return category;
} 

module.exports = { findAll, findOne, create, update, destroy}
