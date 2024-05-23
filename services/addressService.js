const prisma = require("../lib/prisma");

const findAll = async (params) => {
    try {
        const { page = 1, perPage = 10, userId = '', cityId = '', searchTerm = '', sortBy = '' } = params;

        console.log("page ", page);
        console.log("perPage ", perPage);
        console.log("userId ", userId);
        console.log("city_id ", cityId);
        console.log("searchTerm ", searchTerm);
        console.log("sortBy ", sortBy);
  
        const offset = (page - 1) * perPage;
        const limit = perPage;
  
        let where = {};
        
        if (userId && userId !== '-999' && !isNaN(parseInt(userId))) {
            where.user_id = parseInt(userId);
        }
        if (cityId && !isNaN(parseInt(cityId))) {
            where.city_id = parseInt(cityId);
        }
        if (searchTerm) {
            const searchConditions = [
                { receiver_name: { contains: searchTerm, mode: 'insensitive' } },
                { receiver_phone: { contains: searchTerm, mode: 'insensitive' } },
                { detail_address: { contains: searchTerm, mode: 'insensitive' } },
                { province: { contains: searchTerm, mode: 'insensitive' } },
            ];
            
            if (!isNaN(parseInt(searchTerm))) {
                searchConditions.push({ postal_code: { equals: parseInt(searchTerm) } })
                searchConditions.push({ user_id: { equals: parseInt(searchTerm) } });
                searchConditions.push({ city_id: { equals: parseInt(searchTerm) } });
            }
            
            where.OR = searchConditions;
        }

        console.log("WHERE ", where);
  
        const totalCount = await prisma.address.count({ where });
  
        const orderBy = sortBy ? { [sortBy]: 'asc' } : undefined;

        console.log("WHERE ", where);
        console.log("ORDER BY ", orderBy);
  
        const addresses = await prisma.address.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy,
        });
  
        if (!addresses || addresses.length === 0) {
            throw { name: "ErrorNotFound", message: "Addresses Not Found" };
        }
  
        const totalPages = Math.ceil(totalCount / perPage);
        return { addresses, totalPages };
    } catch (error) {
        console.error("Error fetching addresses:", error);
        throw { name: "ErrorFetch", message: "Error Fetching Addresses" };
    }
};

const findOne = async (params) => {
    const { user_id, id } = params;
    try {
        if (!id) {
            throw { name: "PleaseInputId", message: "Please provide an ID" };
        }

        let where = { id: parseInt(id) };
        if (user_id !== -999) {
            where.user_id = user_id;
        }

        const getById = await prisma.address.findUnique({ where });

        if (!getById) {
            throw { name: "ErrorNotFound", message: "Address Not Found" };
        }
        return getById;
    } catch (error) {
        throw { name: "ErrorFetch", message: "Error Fetching Address" };
    }
};

const create = async (params) => {
    try {
        const { user_id, body } = params;
        const { receiver_name, receiver_phone, detail_address, city_id, province, postal_code } = body;

        console.log("User_id", user_id);
        console.log("Body", body);

        if (!receiver_name || !receiver_phone || !detail_address || !city_id || !province || !postal_code || (!user_id && user_id !== -999)) {
            throw { name: "PleaseFillAllRequirement", message: "Please fill all required fields" };
        }

        const newUserId = user_id === -999 ? body.user_id : user_id;
        if (!newUserId) {
            throw { name: "PleaseFillAllRequirement", message: "User ID is required" };
        }

        const address = await prisma.address.create({
            data: {
                receiver_name,
                receiver_phone,
                detail_address,
                city_id,
                province,
                postal_code,
                user_id: newUserId
            }
        });

        return address;
    } catch (error) {
        throw { name: "ErrorCreate", message: "Failed to Create Address" };
    }
};

const update = async (params) => {
    try {
        const { user_id, id, body } = params;
        const { receiver_name, receiver_phone, detail_address, city_id, province, postal_code } = body;
        
        if (!id) {
            throw { name: "PleaseInputId", message: "Please provide an ID" };
        }

        let where = { id: parseInt(id) };
        if (user_id !== -999) {
            where.user_id = user_id;
        }

        const address = await prisma.address.findUnique({ where });

        if (!address) {
            throw { name: "ErrorNotFound", message: "Address Not Found" };
        }

        if (user_id !== -999 && address.user_id !== user_id) {
            throw { name: "Unauthorized", message: "You are not authorized to update this address" };
        }

        const updatedAddress = await prisma.address.update({
            where: { id: parseInt(id) },
            data: {
                receiver_name,
                receiver_phone,
                detail_address,
                city_id,
                province,
                postal_code,
                user_id: user_id === -999 ? body.user_id : user_id
            }
        });

        return updatedAddress;
    } catch (error) {
        throw { name: "ErrorUpdate", message: "Failed to Update Address" };
    }
};

const destroy = async (params) => {
    const { user_id, id } = params;
    try {
        if (!id) {
            throw { name: "PleaseInputId", message: "Please provide an ID" };
        }

        let where = { id: parseInt(id) };
        if (user_id !== '-999') {
            where.user_id = user_id;
        }

        const address = await prisma.address.findUnique({ where });

        if (!address) {
            throw { name: "ErrorNotFound", message: "Address Not Found" };
        }

        if (user_id !== '-999' && address.user_id !== user_id) {
            throw { name: "Unauthorized", message: "You are not authorized to delete this address" };
        }

        const deletedAddress = await prisma.address.delete({ where: { id: parseInt(id) } });
        return deletedAddress;
    } catch (error) {
        throw { name: "ErrorDelete", message: "Failed to Delete Address" };
    }
};

module.exports = { findAll, findOne, create, update, destroy };