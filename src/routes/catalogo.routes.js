const express = require("express");
const router = express.Router();
let db = require("./db");
const {
  obtenerProductos,
  producto,
} = require("../controllers/catalogo.controller");

router.get("/", async (req, res) => {
  try {
    const productos = await obtenerProductos();
    console.log(productos);
    res.render("producto/catalogo", { productos });
  } catch (error) {
    console.log("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

router.get("/producto/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const productos = await producto(id);
    console.log(productos);
    res.render("producto/producto", { productos });
  } catch (error) {
    console.log("Error al obtener producto:", error);
    res.status(500).send("Error al obtener producto");
  }
});
module.exports = router;
