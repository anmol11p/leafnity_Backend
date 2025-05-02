import {
  addorUpdateInCart,
  cartInfoById,
  CheckItemExist,
  checkPlant,
  clearCart,
  deleteItemById,
} from "../ImpFunctions/cart.function.js";

const addToCart = async (req, res, next) => {
  try {
    const { plantId, quantity } = req.body;
    if (!plantId) {
      return res.status(404).json({ message: "plantId is not found" });
    }
    if (!quantity) {
      return res.status(404).json({ message: "quantity is not found" });
    }
    const userId = req.user.id;
    const plantExist = await checkPlant(plantId);
    if (!plantExist) {
      return res.status(404).json({ message: "Plant not found" });
    }
    const cartItem = await addorUpdateInCart({
      plantId,
      quantity,
      userId,
    });
    // console.log(cartItem);
    if (!cartItem) {
      return res.status(400).json({ message: "something wrong in backend..." });
    }
    return res
      .status(200)
      .json({ message: "product added successfully", cartItem });
  } catch (error) {
    next(error);
  }
};
const getCartInfo = async (req, res, next) => {
  try {
    const { id } = req.user;
    const allCartItems = await cartInfoById(id);

    return res.status(200).json({ cart: allCartItems });
  } catch (error) {
    next(error);
  }
};
const deleteCartItemById = async (req, res, next) => {
  try {
    const { plantId } = req.params;
    const { id } = req.user;
    const existingCartItem = await CheckItemExist(id, plantId);

    if (!existingCartItem) {
      return res.status(404).json({
        message: `cart item with plant id ${plantId} and user id ${id} is not founded`,
      });
    }
    await deleteItemById(plantId, id);
    return res.status(200).json({
      message: `plant Deleted SuccessFully..`,
    });
  } catch (error) {
    next(error);
  }
};
const clearTheCart = async (req, res, next) => {
  try {
    const { id } = req.user;
    const clear = await clearCart(id);
    if (!clear || clear.count === 0) {
      return res
        .status(404)
        .json({ message: `no item has been found to be deleted..` });
    }
    return res.status(200).json({
      message: `${clear.count} item from cart is cleared successfully`,
    });
  } catch (error) {
    next(error);
  }
};
export { addToCart, getCartInfo, deleteCartItemById, clearTheCart };
