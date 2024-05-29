const prisma = require("../lib/prisma");

const findAll = async (params) => {
    const { search = '', limit } = params;
    try {
        const queryOptions = {
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
        };

        // Jika limit disertakan dan valid, tambahkan opsi limit ke query
        if (limit && !isNaN(limit)) {
            queryOptions.take = Number(limit);
        }

        const cities = await prisma.city.findMany(queryOptions);
        return cities;
    } catch (error) {
        throw ({ name: "ErrorNotFound", message: "Cities Not Found" });
    }
};

const findAllWithNoLimit = async (params) => {
    try {
        const cities = await prisma.city.findMany(params);
        return cities;
    } catch (error) {
        throw ({ name: "ErrorNotFound", message: "Cities Not Found" })
    }
};

const findOne = async (params) => {
    try {
        const id = parseInt(params.id);

        //check if city id exist
        const city = await prisma.city.findUnique({
            where: { id: id }
        });
        
        if (!city) {
            throw { name: "CityNotFound" };
        }
        return city;
    } catch (error) {
        throw ({ name: "ErrorNotFound", message: "City Not Found" })
    }
};

module.exports = { findAll, findOne, findAllWithNoLimit };
