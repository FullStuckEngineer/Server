const prisma = require("../lib/prisma")

const findAll = async (params) => {
    try {
        const getAll = await prisma.store.findMany()
        return getAll
    } catch (error) {
        throw error
    }
}

const findOne = async (params) => {
    const { id } = params
    try {
        const getOne = await prisma.store.findUnique({
            where: { id: Number(id) }
        })
        if (!getOne) {
            throw ({ name: "StoreNotFound" })
        } else {
            return getOne
        }
    } catch (error) {
        throw error
    }
}

const create = async (params) => {
    try {
        const totalStore = await prisma.store.count()

        if (totalStore >= 1) {
            throw { name: "StoreLimitReached" }
        }

        const { name, city_id, province, postal_code, bank_account_number } = params

        if (!name || !city_id || !province || !postal_code || !bank_account_number) {
            throw { name: "PleaseFillAllRequirement" }
        }
        const createStore = await prisma.store.create({
            data: params
        })
        return createStore
    } catch (error) {
        throw error
    }
}

const update = async (params) => {
    try {
        const { id, body } = params
        const findStore = await prisma.store.findUnique({
            where: { id: Number(id) },
        })

        if (!findStore) {
            throw { name: "StoreNotFound" }
        }

        const updateStore = await prisma.store.update({
            where:
            {
                id: Number(id)
            },
            data: body 
        })
        return updateStore
    } catch (error) {
        throw error
    }
}

const destroy = async (params) => {
    const { id } = params
    try {
        const findStore = await prisma.store.findUnique({
            where: { id: Number(id) },
        })

        if (!findStore) {
            throw { name: "StoreNotFound" }
        }
        
        const deleteStore = await prisma.store.delete({
            where: {
                id: Number(id)
            }
        })

        if (!deleteStore) {
            throw { name: "FailedToDeleteStore" }
        }
        return deleteStore
    } catch (error) {
        throw error
    }
}

module.exports = { findAll, findOne, create, update, destroy }
