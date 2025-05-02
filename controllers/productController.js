import {
  getAllProductsFromDb,
  GetSearchPlants,
  PlantInfo,
  saveplantDb,
} from "../ImpFunctions/product.function.js";

const getAllProducts = async (req, res, next) => {
  try {
    const { plantName, plantId } = req.query;
    if (plantName && plantId) {
      const plantInfo = await PlantInfo(plantId);
      if (!plantInfo) {
        return res
          .status(400)
          .json({ message: "data is not found of this plantName" });
      }
      return res.status(200).json({ plantInfo });
    } else {
      const data = await getAllProductsFromDb();
      return res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
};

const getSearchProducts = async (req, res, next) => {
  try {
    let { plantName } = req.query;
    if (!plantName) {
      return res.status(404).json({ message: "plant name is not founded.." });
    }
    plantName = plantName.toLowerCase().trim();
    const searchData = await GetSearchPlants(plantName);
    if (!searchData || searchData.length === 0) {
      return res
        .status(404)
        .json({ message: `no response is founded with product ${plantName}` });
    }
    return res.status(200).json({ data: searchData });
  } catch (error) {
    next(error);
  }
};

const saveAllProducts = async (req, res, next) => {
  try {
    const saveProducts = await saveplantDb();
    const { count } = saveProducts;
    if (count === 0) {
      return res.status(400).json({ message: "data is not created!!" });
    }
    return res.status(201).json({ data: saveProducts });
  } catch (error) {
    next(error);
  }
};
export { getAllProducts, getSearchProducts, saveAllProducts };
