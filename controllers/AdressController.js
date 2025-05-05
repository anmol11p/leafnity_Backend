import {
  addressDelete,
  checkOrder_with_AdressId,
  ExistAddress,
  getAddressById,
  GetAllAddress,
  saveAddress,
  updateAddressbyId,
} from "../ImpFunctions/Address.function.js";

const createAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { phone, street, city, state, postalCode, country, fullName } =
      req.body;

    const address = await saveAddress({
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      id,
      fullName,
    });

    return res.status(200).json({ message: "Adress created successfully!" });
  } catch (error) {
    next(error);
  }
};
const deleteAddress = async (req, res, next) => {
  try {
    let { addressId } = req.params;
    if (!addressId) {
      return res.status(404).json({ message: "address Id is not founded!!" });
    }
    const addressExist = await ExistAddress(addressId);
    if (!addressExist) {
      return res
        .status(400)
        .json({ message: "this address is not existed in DB to be deleted!!" });
    }
    // check whether addressId is not linked with order
    const { id } = req.user;
    const orderWithAddressId = await checkOrder_with_AdressId(id, addressId);
    if (orderWithAddressId instanceof Error) {
      return res
        .status(500)
        .json({ message: "Server error", error: orderWithAddressId.message });
    }
    if (orderWithAddressId) {
      return res.status(401).json({
        message: "This address is linked to an order and cannot be deleted.",
      });
    }
    await addressDelete(addressId);
    return res.status(200).json({ message: "address deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllAdress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const getAllAdresses = await GetAllAddress(id);
    if (!getAllAdresses) {
      return res.status(400).json({ message: "no address found.." });
    }
    return res.status(200).json({ success: true, address: getAllAdresses });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    let { addressId } = req.params;
    if (!addressId) {
      return res.status(404).json({ message: `address id is not founded` });
    }
    addressId = Number(addressId);
    const addressExist = await ExistAddress(addressId);
    if (!addressExist) {
      return res
        .status(400)
        .json({ message: "this address is not existed in DB to be updated!!" });
    }
    const { phone, street, city, state, postalCode, country, fullName } =
      req.body;

    const update = await updateAddressbyId(addressId, {
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      fullName,
    });
    if (!update) {
      return res.status(400).json({ message: "address is not updated" });
    }
    return res.status(200).json({ message: "address updated successfully" });
  } catch (error) {
    next(error);
  }
};
const getAddress = async (req, res, next) => {
  try {
    let { addressId } = req.params;
    if (!addressId) {
      return res.status(404).json({ message: `address id is not founded` });
    }
    addressId = Number(addressId);
    const addressExist = await ExistAddress(addressId);
    if (!addressExist) {
      return res.status(400).json({
        message: "this address is not existed in DB that you find..!!",
      });
    }
    const Address = await getAddressById(addressId);
    if (!Address) {
      return res.status(404).json({
        message: "this address is not updated",
      });
    }
    return res
      .status(200)
      .json({ message: "address fetched success", Address });
  } catch (error) {
    next(error);
  }
};

export {
  createAddress,
  updateAddress,
  deleteAddress,
  getAllAdress,
  getAddress,
};
