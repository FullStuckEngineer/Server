const prisma = require("../lib/prisma")
const { param } = require("../routes/cartRoute")

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
    const id = Number(params.id)
    try {
        const getById = await prisma.address.findUnique({
            where: { id }
        })
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
        const { id, body } = params
        const address = await prisma.address.update({
            where: { id: Number(id) },
            data: body
        })
        return address
    } catch (error) {
        throw error
    }
}

const destroy = async (params) => {
    const {user_id, id} = params
    try {
        const findId = await prisma.address.findUnique({where: { user_id, id: Number(id) }})
        if (!findId) {
            throw {name: "ErrorNotFound"}
        }
        const deleteAddress = await prisma.address.delete({where: { user_id, id: Number(id) }})
        return deleteAddress
    } catch (error) {
        throw error
    }
}

module.exports = { findAll, findOne, create, update, destroy }