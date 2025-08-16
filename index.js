import "dotenv/config";
import express from "express";
import path from "path";
import * as url from "url";
import cors from "cors";                     // ✅ NEW: allow React to call API
// If your Mongo connection lives inside db.js, you don't need mongoose here.
import db from "./modules/lynx/db.js";       // your db helpers

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// ------------------- App setup -------------------
const app = express();
const port = process.env.PORT || "8888";

// ✅ CORS: allow local React dev + your deployed React site
app.use(cors({
  origin: ["http://localhost:5173"],   // only allow your local React dev server
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// ✅ Body parsers
app.use(express.json());                     // for JSON APIs
app.use(express.urlencoded({ extended: true })); // keep for your Pug admin forms

// ------------------- Views & static -------------------
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.disable("view cache");
app.set("view cache", false);

// If your static files live in /public (css, images, js)
app.use(express.static(path.join(__dirname, "public")));

// If you serve images/CSS from specific folders, you can also do:
// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/css", express.static(path.join(__dirname, "css")));

// ------------------- Health check -------------------
app.get("/health", (req, res) => res.json({ ok: true }));

// ------------------- Pages -------------------
app.get("/", async (req, res) => {
  console.log("Rendering index.pug now");

  let productList = await db.getProducts();
  let categoryList = await db.getCategories();

  // Initialize collections if empty (avoid duplicate reassignments)
  if (!productList.length) {
    await db.initializeProducts();
    productList = await db.getProducts();
    console.log("Products after init:", productList.length);
  }
  if (!categoryList.length) {
    await db.initializeCategories();
    categoryList = await db.getCategories();
    console.log("Categories after init:", categoryList.length);
  }

  res.render("index", {
    title: "Home | Lynx",
    products: productList,
    categories: categoryList
  });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// ------------------- API: Products -------------------
app.get("/api/products", async (req, res) => {
  try {
    let products = await db.getProducts();
    if (!products.length) {
      await db.initializeProducts();
      products = await db.getProducts();
    }
    res.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/products", async (req, res) => {
  let products = await db.getProducts();
  if (!products.length) {
    await db.initializeProducts();
    products = await db.getProducts();
  }
  res.render("products", { products });
});

app.get("/addProduct", (req, res) => {
  res.render("addProduct", { title: "Add Product" });
});

app.post("/products/add", async (req, res) => {
  const { id, title, price, image } = req.body;
  await db.addProduct(id, title, price, image);
  res.redirect("/products");
});

app.get("/products/edit/:id", async (req, res) => {
  const product = (await db.getProducts()).find(p => String(p.id) === req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render("editProduct", { title: "Edit Product", product });
});

app.post("/products/edit/:id", async (req, res) => {
  const { title, price, image } = req.body;
  await db.updateProductDetails(req.params.id, title, price, image);
  res.redirect("/products");
});

app.get("/products/delete/:id", async (req, res) => {
  await db.deleteProductsById(req.params.id);
  res.redirect("/products");
});

// ------------------- API: Categories -------------------
app.get("/api/categories", async (req, res) => {
  try {
    let categories = await db.getCategories();
    if (!categories.length) {
      await db.initializeCategories();
      categories = await db.getCategories();
    }
    res.json(categories);
  } catch (err) {
    console.error("GET /api/categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/categories", async (req, res) => {
  let categories = await db.getCategories();
  if (!categories.length) {
    await db.initializeCategories();
    categories = await db.getCategories();
  }
  res.render("categories", { categories });
});

app.get("/addCategory", (req, res) => {
  res.render("addCategory", { title: "Add category" });
});

app.post("/categories/add", async (req, res) => {
  const { id, name, description } = req.body;
  await db.addCategory(id, name, description);
  res.redirect("/categories");
});

app.get("/categories/edit/:id", async (req, res) => {
  const category = (await db.getCategories()).find(c => String(c.id) === req.params.id);
  if (!category) return res.status(404).send("Category not found");
  res.render("editCategory", { title: "Edit Category", category });
});

app.post("/categories/edit/:id", async (req, res) => {
  const { name, description } = req.body;
  await db.updateCategoryDetails(req.params.id, name, description);
  res.redirect("/categories");
});

app.get("/categories/delete/:id", async (req, res) => {
  await db.deleteCategoriesById(req.params.id);
  res.redirect("/categories");
});

// ------------------- Start server -------------------
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
