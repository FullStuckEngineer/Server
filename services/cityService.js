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
        const id = parseInt(params.id);
        const filter = {
            where:
                { id: id }
        };
        const city = await prisma.city.findUnique(filter);
        return city;
    } catch (error) {
        throw error;
    }
};

module.exports = { findAll, findOne };
