import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const checkPlant = async (plantId) => {
  try {
    const resp = await prisma.plant.findUnique({
      where: { id: plantId },
    });
    // console.log(resp);
    return resp;
  } catch (error) {
    return error;
  }
};

export const addorUpdateInCart = async ({ plantId, quantity, userId }) => {
  try {
    const plant = await prisma.plant.findUnique({
      where: { id: plantId },
      select: { selling_price: true },
    });
    if (!plant) {
      return { error: "Plant not found" };
    }

    const { selling_price } = plant;
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId: userId,
        plantId: plantId,
      },
    });

    if (existingCartItem) {
      let newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity <= 0) {
        await prisma.cart.delete({
          where: {
            id: existingCartItem.id,
          },
        });
      }
      const updatedCartItem = await prisma.cart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
          totalPrice: newQuantity * selling_price,
        },
      });

      return updatedCartItem;
    } else {
      // If item does not exist, create a new entry
      const newCartItem = await prisma.cart.create({
        data: {
          userId: userId,
          plantId: plantId,
          quantity,
          totalPrice: quantity * selling_price,
        },
      });
      return newCartItem;
    }
  } catch (error) {
    return { error };
  }
};

export const cartInfoById = async (userId) => {
  try {
    const cart = await prisma.cart.findMany({
      where: { userId },
      include: {
        plant: true,
      },
    });
    return cart;
  } catch (error) {
    return error;
  }
};

export const CheckItemExist = async (id, plantId) => {
  try {
    const resp = await prisma.cart.findUnique({
      where: {
        userId_plantId: {
          userId: id,
          plantId,
        },
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
export const deleteItemById = async (plantId, userId) => {
  try {
    const resp = await prisma.cart.delete({
      where: {
        userId_plantId: {
          userId,
          plantId,
        },
      },
    });
    if (resp) {
      return resp;
    }
  } catch (error) {
    return error;
  }
};
export const clearCart = async (userId) => {
  try {
    const clear = await prisma.cart.deleteMany({ where: { userId } });
    return clear;
  } catch (error) {
    return error;
  }
};
