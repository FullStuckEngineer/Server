const prisma = require("../lib/prisma");

const findAll = async (params) => {
  const sql = await prisma.courier.findMany(params);
  return sql;
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
    throw (error)
  }
 
};

const destroy = async (params) => {
  const { id } = params;

  const sql = await prisma.courier.delete({
    where: {
      id: +id,
    },
  });
  return sql;
};
module.exports = { findAll, findOne, create, update, destroy };