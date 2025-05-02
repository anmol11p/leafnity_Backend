import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllProductsFromDb = async () => {
  try {
    const data = prisma.plant.findMany();
    if (data.length !== 0) {
      return data;
    }
  } catch (error) {
    return error;
  }
};

const PlantInfo = async (id) => {
  try {
    const data = await prisma.plant.findUnique({
      where: { id },
    });

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const GetSearchPlants = async (plant_name) => {
  try {
    const resp = await prisma.plant.findMany();
    if (!resp) {
      return;
    }
    const searchData = resp.filter((item) => {
      const plantData = item.plant_name.toLowerCase();

      return plantData.includes(plant_name);
    });
    return searchData;
  } catch (error) {
    return error;
  }
};

const saveplantDb = async () => {
  try {
    const resp = await prisma.plant.createMany({
      data: [
        {
          plant_name: "Areca Palm",
          total_price: 1200,
          selling_price: 1080,
          percent_off: "10%",
          rating: 4,
          image_src: "images/product1.webp",
          description:
            "Areca Palm is a popular air-purifying plant known for its elegant, feathery fronds. It thrives in bright, indirect light and helps improve indoor humidity levels, making it a great choice for homes and offices.",
        },
        {
          plant_name: "Snake Plant",
          total_price: 950,
          selling_price: 902.5,
          percent_off: "5%",
          rating: 5,
          image_src: "images/product2.webp",
          description:
            "Snake Plant, also known as Mother-in-Law's Tongue, is a hardy indoor plant that thrives on neglect. It effectively filters indoor air pollutants and can survive in low light with minimal watering.",
        },
        {
          plant_name: "Money Plant",
          total_price: 700,
          selling_price: 595,
          percent_off: "15%",
          rating: 5,
          image_src: "images/product3.webp",
          description:
            "Money Plant is a fast-growing, easy-to-care-for plant believed to bring prosperity and good luck. It thrives in both soil and water, making it a versatile addition to any indoor space.",
        },
        {
          plant_name: "Peace Lily",
          total_price: 1100,
          selling_price: 880,
          percent_off: "20%",
          rating: 5,
          image_src: "images/product4.webp",
          description:
            "Peace Lily is a beautiful flowering plant with glossy green leaves and elegant white blooms. It purifies indoor air and thrives in low to medium light conditions, making it perfect for bedrooms and offices.",
        },
        {
          plant_name: "Spider Plant",
          total_price: 850,
          selling_price: 765,
          percent_off: "10%",
          rating: 4,
          image_src: "images/product5.webp",
          description:
            "Spider Plant is a low-maintenance air-purifying plant known for its arching green-and-white striped leaves. It is resilient, grows quickly, and thrives in a variety of indoor environments.",
        },
        {
          plant_name: "Aloe Vera",
          total_price: 500,
          selling_price: 475,
          percent_off: "5%",
          rating: 5,
          image_src: "images/product6.webp",
          description:
            "Aloe Vera is a medicinal succulent known for its healing properties. Its gel-filled leaves are used for skincare and treating burns. It thrives in bright light and requires minimal watering.",
        },
        {
          plant_name: "Fiddle Leaf Fig",
          total_price: 2500,
          selling_price: 1875,
          percent_off: "25%",
          rating: 4,
          image_src: "images/product7.webp",
          description:
            "Fiddle Leaf Fig is a trendy indoor plant with large, glossy leaves. It adds a modern, tropical touch to any space and thrives in bright, indirect light with moderate watering.",
        },
        {
          plant_name: "Rubber Plant",
          total_price: 1500,
          selling_price: 1275,
          percent_off: "15%",
          rating: 5,
          image_src: "images/product8.webp",
          description:
            "Rubber Plant is a stylish and hardy plant with dark green, waxy leaves. It improves air quality and requires minimal care, making it a perfect choice for homes and offices.",
        },
        {
          plant_name: "Bamboo Palm Plant",
          total_price: 900,
          selling_price: 810,
          percent_off: "10%",
          rating: 4,
          image_src: "images/product9.webp",
          description:
            "Bamboo Palm is an elegant indoor plant with feathery fronds that bring a tropical feel to any space. It thrives in low light and helps maintain indoor humidity levels.",
        },
        {
          plant_name: "Christmas Cactus",
          total_price: 1200,
          selling_price: 960,
          percent_off: "20%",
          rating: 5,
          image_src: "images/product10.webp",
          description:
            "Christmas Cactus is a beautiful flowering plant that blooms in winter, producing vibrant pink, red, or white flowers. It thrives in indirect sunlight and requires moderate watering.",
        },
      ],

      skipDuplicates: true,
    });
    return resp;
  } catch (error) {
    return error;
  }
};
export { GetSearchPlants, PlantInfo, getAllProductsFromDb, saveplantDb };
