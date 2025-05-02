import { PrismaClient } from "@prisma/client";
import { checkPlant } from "./cart.function.js";
const prisma = new PrismaClient();

const getPlantPrice = async (plantId) => {
  try {
    const plantInfo = await checkPlant(plantId);
    return plantInfo.selling_price;
  } catch (error) {
    return 0;
  }
};
const create = async (
  userId,
  totalAmount,
  items,
  addressId,
  razorpayOrderId
) => {
  try {
    const itemsWithPrize = await Promise.all(
      items.map(async (item) => {
        const plantPrice = await getPlantPrice(item.plantId);
        return {
          plantId: item.plantId,
          quantity: item.quantity,
          totalAmount: item.quantity * plantPrice,
        };
      })
    );
    const resp = await prisma.customerOrder.create({
      data: {
        userId,
        totalAmount,
        addressId,
        razorpayOrderId,
        items: {
          create: itemsWithPrize,
        },
      },
      include: {
        items: true,
      },
    });
    console.log(resp);
    return resp;
  } catch (error) {
    return error;
  }
};

const GetAllOrder = async (userId) => {
  try {
    const resp = await prisma.customerOrder.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            plant: true,
            order: true,
          },
        },
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const checkOrderItem = async (id) => {
  try {
    const resp = await prisma.orderItem.findUnique({
      where: {
        id,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
const orderItem = async (id) => {
  try {
    const resp = await prisma.orderItem.findUnique({
      where: {
        id,
      },
      include: {
        plant: true,
        order: true,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const updateOrderStatus = async (id) => {
  try {
    const response = await prisma.orderItem.update({
      where: {
        id,
      },
      data: {
        status: "Refunded",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
export { create, GetAllOrder, checkOrderItem, updateOrderStatus, orderItem };
