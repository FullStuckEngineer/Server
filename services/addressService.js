const prisma = require("../lib/prisma")

const findAll = async (params) => {
    try {
        const { id } = params
        const getAll = await prisma.address.findMany({ where: { user_id: id } })
        return getAll
    } catch (error) {
        throw ({ name: "ErrorFetch", message: "Error Fetching Addresses" })
    }
}

const findOne = async (params) => {
    const { user_id, id } = params
    try {
        const getById = await prisma.address.findUnique({
            where: { user_id, id: Number(id) }
        })
        if (!getById) {
            throw ({ name: "ErrorNotFound", message: "Address Not Found" })
        } else {
            return getById
        }
    } catch (error) {
        throw ({ name: "ErrorFetch", message: "Error Fetching Address" })
    }
}

const create = async (params) => {
    try {
        const { receiver_name, receiver_phone, detail_address, city_id, province, postal_code } = params;

        if (!receiver_name || !receiver_phone || !detail_address || !city_id || !province || !postal_code) {
            throw { name: "PleaseFillAllRequirement" };
        }

        const address = await prisma.address.create({
            data: params
        })

        return address
    } catch (error) {
        throw { name: "ErrorCreate", message: "Failed to Create Address"};
    }
}

const update = async (params) => {
    try {
        const { user_id, id, body } = params
        const address = await prisma.address.findUnique({
            where: { id: Number(id) }
        })

        if (!address || address.user_id !== user_id) {
            throw { name: "Unauthorized" }
        }

        const updatedAddress = await prisma.address.update({
            where: { id: Number(id)},
            data: body
        })
        return updatedAddress
    } catch (error) {
        throw { name: "ErrorUpdate", message: "Failed to Update Category"};
    }
}

const destroy = async (params) => {
    const { user_id, id } = params
    try {
        const findId = await prisma.address.findUnique({ where: { user_id, id: Number(id) } })
        if (!findId) {
            throw { name: "ErrorNotFound" }
        }
        const deleteAddress = await prisma.address.delete({ where: { user_id, id: Number(id) } })
        return deleteAddress
    } catch (error) {
        throw { name: "ErrorDelete", message: "Failed to Delete Category"};
    }
}

module.exports = { findAll, findOne, create, update, destroy }