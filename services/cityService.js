const prisma = require("../lib/prisma");

const findAll = async (params) => {
    try {
        const cities = await prisma.city.findMany();
        return cities;
    } catch (error) {
        throw error;
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
        throw error;
    }
};

module.exports = { findAll, findOne };
