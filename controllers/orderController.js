import Razorpay from "razorpay";
import {
  checkOrderItem,
  create,
  GetAllOrder,
  orderItem,
  updateOrderStatus,
} from "../ImpFunctions/order.function.js";
import { PlantInfo } from "../ImpFunctions/product.function.js";
import crypto from "crypto";
import {
  ExistAddress,
  getAddressById,
} from "../ImpFunctions/Address.function.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
const createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const generate_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    if (generate_signature === razorpay_signature) {
      return res
        .status(200)
        .json({ success: true, message: "payment verified successfully!" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed!" });
    }
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    let { razorpayOrderId, id, totalAmount } = req.body;
    totalAmount = parseInt(totalAmount);

    if (!razorpayOrderId || !id || !totalAmount) {
      return res.status(404).json({
        message: `razorpay order id  or orderItem or totalAmount  is not found..`,
      });
    }
    const payments = await razorpay.orders.fetchPayments(razorpayOrderId);
    // console.log(payments);
    if (payments.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No payments found for this order!" });
    }
    const paymentId = payments.items[0].id;
    const resp = await razorpay.payments.refund(paymentId, {
      amount: totalAmount * 100,
    });
    // console.log(resp);
    if (!resp) {
      return res
        .status(400)
        .json({ success: false, message: "payment has not been cancelled" });
    }

    const update = await updateOrderStatus(id);
    if (!update) {
      return res
        .status(400)
        .json({ success: false, message: "order is not updated in DB.." });
    }

    return res.json({
      success: true,
      message: "Order Cancelled & Refunded Successfully!",
      update,
    });
  } catch (error) {
    next(error);
  }
};
const saveOrderInDb = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { totalAmount, items, addressId, razorpayOrderId } = req.body;

    const addressExist = await ExistAddress(addressId);
    if (!addressExist) {
      return res.status(400).json({
        message: "this address is not existed in DB that you find..!!",
      });
    }
    // console.log(addressExist);
    const plantExistResults = await Promise.all(
      items.map(async (item) => {
        const plantInfo = await PlantInfo(item.plantId);
        return { plantId: item.plantId, exists: !!plantInfo };
      })
    );
    // console.log(plantExistResults);
    const missingPlant = plantExistResults.filter((p) => {
      return !p.exists;
    });
    // console.log(missingPlant);
    if (missingPlant && missingPlant.length !== 0) {
      return res.status(404).json({
        message: `plant is not found with ${
          missingPlant.length > 1 ? "ids " : "id"
        }:${missingPlant.map((p) => p.plantId).join(",")}`,
      });
    }
    const order = await create(
      id,
      totalAmount,
      items,
      addressId,
      razorpayOrderId
    );
    // console.log("order ==>", order);
    return res
      .status(200)
      .json({ message: `order placed  successfully`, order });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const getAllOrderItem = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(404).json({ message: "User ID not found" });
    }

    const orders = await GetAllOrder(id);
    if (!orders.length) {
      return res.status(404).json({ message: "No order details found." });
    }

    return res.status(200).json({ details: orders });
  } catch (error) {
    next(error);
  }
};

const getOrderItem = async (req, res, next) => {
  try {
    let { orderItemId } = req.params;
    if (!orderItemId) {
      return res.status(404).json({ message: "order item id is not found" });
    }
    const exist = await checkOrderItem(orderItemId);
    if (!exist) {
      return res
        .status(404)
        .json({ message: "the order id is not existed in db" });
    }
    const itemDetails = await orderItem(orderItemId);
    if (!itemDetails) {
      return res.status(404).json({ message: "item details is not founded" });
    }
    const { addressId } = itemDetails.order;

    const Address = await getAddressById(addressId);
    return res
      .status(200)
      .json({ orderDetails: itemDetails, address: Address });
  } catch (error) {
    next(error);
  }
};
export {
  createOrder,
  verifyPayment,
  saveOrderInDb,
  getAllOrderItem,
  getOrderItem,
  cancelOrder,
};
