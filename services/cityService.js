const prisma = require("../lib/prisma");

const findAll = async (params) => {
    try {
        const { page = 1, perPage = 10, searchTerm = ''} = params;

        const offset = (page - 1) * perPage;
        const limit = perPage;

        let where = {};
        if (searchTerm) {
            where.OR = [
                { name: { contains: searchTerm, mode: 'insensitive' } },
            ]
        }

        const totalCount = await prisma.city.count({
            where
        });

        const cities = await prisma.city.findMany({
            where,
            skip: offset,
            take: limit
        });

        if (!cities || cities.length === 0) {
            throw { name: "ErrorNotFound", message: "Cities Not Found" };
        }

        const totalPages = Math.ceil(totalCount / perPage);
        return { cities, totalPages };
    } catch (error) {
        throw ({ name: "ErrorNotFound", message: "Cities Not Found" })
    }
};


const findOne = async (params) => {
    try {
        const id = parseInt(params);
        const filter = {
            where:
                { id: id }
        };
        //check if city id exist
        const city = await prisma.city.findUnique(filter);
        if (!city) {
            throw { name: "CityNotFound" };
        }
        return city;
    } catch (error) {
        throw ({ name: "ErrorNotFound", message: "City Not Found" })
    }
};

module.exports = { findAll, findOne };
