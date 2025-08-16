import mongoose from "mongoose";

const dbUrl = `${process.env.MONGO_URI}${process.env.DB_NAME}`;

//set up Schema and model
const ProductSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  image: String
},{ collection: "Products" });
const Product = mongoose.model("Product", ProductSchema);

const CategorySchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String
},{ collection: "Categories" });
const Category = mongoose.model("Category", CategorySchema);

console.log("Connecting to MongoDB at:", dbUrl);
await mongoose.connect(dbUrl);
console.log("MongoDB connected");

//MONGODB FUNCTIONS
/* async function connect() {
  await mongoose.connect(dbUrl); //connect to mongodb
} */

//Get all products from the Products collection
async function getProducts() {
  return await Product.find({}); //return array for find all
}
async function initializeProducts() {
  const products = [
    {
      id:16,
      title: "Plaid Collared Short Sleeve Top",
      price: 16.99,
      image: "/images/dress16.png"
    },
    {
      id:17,
      title: " Floral Puff Sleeve Crop Top ",
      price: 16.00,
      image: "/images/dress17.png"
    },
     {
      id:18,
      title: " Textured Corset Tank ",
      price: 20.00,
      image: "/images/dress18.png"
    },
    {
      id:19,
      title: " Printed Button-Up T-Shirt & Pant 2 Piece Pajama Set ",
      price: 20.00,
      image: "/images/dress19.png"
    },
    {
      id:20,
      title: "  Ribbed Button-Up Top & Short 2 Piece Pajama Set  ",
      price: 16.00,
      image: "/images/dress20.png"
    }
  ];
  await Product.insertMany(products);
}
async function addProduct(productId,productTitle, productPrice, productImage) {
  let newProduct = new Product({
    id: Number(productId),
    title: String(productTitle),
    price: Number(productPrice),
    image: String(productImage)
  });
  await newProduct.save(); //save to the DB
}

async function updateProductDetails(productId, productTitle, productPrice, productImage) {
  await Product.updateOne({ id: Number(productId) },
    { 
      title: String(productTitle), 
      price: Number(productPrice), 
      image: String(productImage) 
    }
  );
}

async function deleteProductsById(id) {
  await Product.deleteMany({ id: id });
}

//Get all categories from the Categories collection
async function getCategories() {
  return await Category.find({}); //return array for find all
}
async function initializeCategories() {
  const categories = [
    {
      id:1,
      name: "Jeans",
      description: "Durable and stylish denim pants available in various fits like skinny, straight, and relaxed. Perfect for casual wear or dressing up with a smart top."
    },
    {
      id:2,
      name: "Pajamas",
      description: "Comfortable sleepwear designed for relaxation and a good night’s sleep. Available in soft fabrics and cozy styles for all seasons. "
    },
     {
      id:3,
      name: "Shirts",
      description: "Classic tops in various styles including button-downs, polos, and casual tees. Ideal for both everyday wear and smart occasions. "
    }
  ];
  await Category.insertMany(categories);
}
async function addCategory(categoryId,categoryName, categoryDescription) {
  let newCategory = new Category({
    id: Number(categoryId),
    name: String(categoryName),
    description: String(categoryDescription)
  });
  await newCategory.save(); //save to the DB
}

async function updateCategoryDetails(categoryId, categoryName, categoryDescription) {
  await Product.updateOne({ id: Number(categoryId) },
    { 
      name: String(categoryName), 
      description: String(categoryDescription)
    }
  );
}

async function deleteCategoriesById(id) {
  await Category.deleteMany({ id: id });
}


export default {
  getProducts,
  initializeProducts,
  addProduct,
  updateProductDetails,
  deleteProductsById,
  getCategories,
  initializeCategories,
  addCategory,
  updateCategoryDetails,
  deleteCategoriesById
}