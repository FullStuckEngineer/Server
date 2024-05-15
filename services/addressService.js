const prisma = require("../lib/prisma")

const findAll = async (params) => {
    try {
        const { id } = params
        const getAll = await prisma.address.findMany({ where: { user_id: id } })
        return getAll
    } catch (error) {
        throw error
    }
}

const findOne = async (params) => {
    const { user_id, id } = params
    try {
        const getById = await prisma.address.findUnique({
            where: { user_id, id: Number(id) }
        })     
        //check if user didnt input id 
        if (id === undefined) {
            throw ({ name: "PleaseInputId" })
        }
        if (!getById) {
            throw ({ name: "ErrorNotFound", message: "Address Not Found" })
        } else {
            return getById
        }
    } catch (error) {
        throw error
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
        throw error
    }
}

const update = async (params) => {
    try {
        const { user_id, id, body } = params
        const address = await prisma.address.findUnique({
            where: { id: Number(id) }
        })
        //check if user didnt input id address
        if (id === undefined) {
            throw ({ name: "PleaseInputId" })
        }

        if (!address || address.user_id !== user_id) {
            throw { name: "ErrorNotFound" }
        }

        const updatedAddress = await prisma.address.update({
            where: { id: Number(id)},
            data: body
        })
        return updatedAddress
    } catch (error) {
        throw error
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
        throw error
    }
}

module.exports = { findAll, findOne, create, update, destroy }