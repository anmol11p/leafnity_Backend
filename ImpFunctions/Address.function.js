import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const saveAddress = async (data) => {
  const { phone, street, city, state, id, postalCode, country, fullName } =
    data;
  try {
    const resp = await prisma.address.create({
      data: {
        userId: id,
        phone,
        fullName,
        country,
        postalCode,
        state,
        street,
        city,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const addressDelete = async (id) => {
  try {
    const resp = await prisma.address.delete({
      where: {
        id,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
const ExistAddress = async (id) => {
  try {
    const resp = await prisma.address.findUnique({
      where: {
        id,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
const GetAllAddress = async (id) => {
  try {
    const resp = await prisma.address.findMany({
      where: {
        userId: id,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
const updateAddressbyId = async (id, data) => {
  try {
    const { phone, street, city, state, postalCode, country, fullName } = data;
    const resp = await prisma.address.update({
      where: {
        id,
      },
      data: {
        phone,
        street,
        city,
        state,
        postalCode,
        country,
        fullName,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const getAddressById = async (id) => {
  try {
    if (!id) {
      return `you deleted your Address Accidentally..`;
    }
    const resp = await prisma.address.findUnique({
      where: {
        id,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

export {
  saveAddress,
  GetAllAddress,
  addressDelete,
  ExistAddress,
  getAddressById,
  updateAddressbyId,
};
