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
            throw ({ name: "ErrorNotFound", message: "Store Not Found" })
        } else {
            return getOne
        }
    } catch (error) {
        throw error
    }
}

const create = async (params) => {
    //validasi admin?
    try {
     const { body } = params   
     
    } catch (error) {
        throw error
    }
 }

const update = async (params) => {
     //validasi admin?
 }

const destroy = async (params) => {
     //validasi admin?
 }

module.exports = { findAll, findOne, create, update, destroy }
