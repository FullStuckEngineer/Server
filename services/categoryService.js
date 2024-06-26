const prisma = require("../lib/prisma");
const productService = require("./productService");

const findAll = async (params) => {
    try {
        const { page = 1, perPage = 10, role = 'User', searchTerm = '', status = '', sortBy = '' } = params;

        const offset = (page - 1) * perPage;
        const limit = perPage;

        let where = {};
        if (role === 'User') {
            where.status = 'Active';
        }
        if (status) {
            where.status = status;
        }
        if (searchTerm) {
            where.OR = [
                { name: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }

        const totalCount = await prisma.category.count({ where });

        const orderBy = sortBy ? { [sortBy]: 'asc' } : undefined;

        const categories = await prisma.category.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy,
        });

        if (!categories || categories.length === 0) {
            throw { name: "ErrorNotFound", message: "Categories Not Found" };
        }

        const totalPages = Math.ceil(totalCount / perPage);
        return { categories, totalPages };
    } catch (error) {
        if (error.name && error.message) {
            throw error;
        } else {
            throw { name: "ErrorFetch", message: "Error Fetching Categories" };
        }
    }
};

const findOne = async (params) => {
    try {
        const { id, role } = params;
        const categoryId = parseInt(id);
    
        let where = {id: categoryId};
        if (role === 'User') {
            where.status = 'Active';
        }
        
        const category = await prisma.category.findUnique({
            where
        });
        if (!category) {
            throw { name: "ErrorNotFound", message: "Category Not Found"};
        }
    
        return category;    
    } catch (error) {
        if (error.name && error.message) {
            throw error;
        } else {
            throw { name: "ErrorFetch", message: "Error Fetching Category" }
        }
    }
} 

const create = async (params) => {
    try{
        const { name } = params;
        const category = await prisma.category.create({
            data: {
                name,
                created_at: new Date(),
                update_at: new Date()
            }
        });
        if (!category) throw { name: "ErrorCreate", message: "Failed to Create Category"};
        return category;    
    } catch (error) {
        if (error.name && error.message) {
            throw error;
        } else {
            throw { name: "ErrorCreate", message: "Failed to Create Category" }
        }
    }
} 

const update = async (params) => {
    try{
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
        if (!category) throw { name: "Failed to Update Category" };
        return category;    
    } catch (error) {
        if (error.name && error.message) {
            throw error;
        } else {
            throw { name: "ErrorUpdate", message: "Failed to Update Category" }
        }
    }
} 

const destroy = async (params) => {
    try{
        await prisma.$transaction(async (prisma) => {

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
            if (!category) throw { name: "Failed to Soft Delete Category" };
            return category;   
        }); 
    } catch (error) {
        if (error.name && error.message) {
            throw error;
        } else {
            throw { name: "ErrorDelete", message: "Failed to Delete Category" }
        }
    }
} 

module.exports = { findAll, findOne, create, update, destroy }