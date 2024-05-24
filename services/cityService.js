const prisma = require("../lib/prisma");



const findAll = async (params) => {
    try {
        const cities = await prisma.city.findMany(params);
        return cities;
    } catch (error) {
        throw ({ name: "ErrorNotFound", message: "Cities Not Found" })
    }
};

const findAllWithLimit = async (params) => {
    const { search = '', limit = 5 } = params;
    try {
        const cities = await prisma.city.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            take: Number(limit),
        });
        return cities;
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

module.exports = { findAll, findOne, findAllWithLimit };
