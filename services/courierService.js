const prisma = require("../lib/prisma");

const findAll = async (params) => {
  try {
    const { page = 1, perPage = 10, searchTerm = '' } = params;

    const offset = (page - 1) * perPage;
    const limit = perPage;

    let where = {};
    if (searchTerm) {
        where.OR = [
            { name: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }

    const totalCount = await prisma.courier.count({ where });

    const couriers = await prisma.courier.findMany({
        where,
        skip: offset,
        take: limit
    });

    if (!couriers || couriers.length === 0) {
        throw { name: "ErrorNotFound", message: "Couriers Not Found" };
    }

    const totalPages = Math.ceil(totalCount / perPage);
    return { couriers, totalPages };
  } catch (error) {
      throw error;
  }
};


const findOne = async (params) => {
  const { id } = params;

  const sql = await prisma.courier.findUnique
    ({

      where: {
        id: +id,
      },
    });
  if (sql === null) {
    throw { name: "InvalidCourier" };
  }
  return sql;

};

const create = async (params) => {

  const sql = await prisma.courier.create({
    data: params
  });
  return sql
};

const update = async (params) => {

  try {
    const {id , name} = params
    const sql = await prisma.courier.upsert
    
      ({
      where: {
        id: +id
      },

      update: {
        name: name,
      },

      create: {
        id: +id,
        name: name
      }
    })
    
    return sql;
  } catch (error) {
    throw ({ name: "ErrorUpdate", message: "Failed to Update Courier" })
  }

};

const destroy = async (params) => {
  try{
    const { id } = params;

    const sql = await prisma.courier.delete({
      where: {
        id: +id,
      },
    });
    return sql;
  } catch (error) {
    throw ({ name: "ErrorDelete", message: "Failed to Delete Courier" })
  }
};

module.exports = { findAll, findOne, create, update, destroy };
