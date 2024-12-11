const express = require("express");
const router = express.Router();
const carrito = require("../controllers/carrito.controller");
const { dolar } = require("../controllers/pago.controller");
const { route } = require("./index.routes");

router.get("/", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }

  const { ID_Usuario } = req.session.user;

  try {
    const productosCarrito = await carrito.obtenerProductosCarrito(ID_Usuario);
    const tipoCambio = await dolar();
    const clientId = process.env.PAYPAL_CLIENT_ID;

    res.render("producto/layout/layout-carrito", {
      products: productosCarrito || [], // Asegúrate de enviar un array vacío si no hay productos
      tipoCambio,
      clientId,
    });
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    res.render("producto/catalogo", { productos: [] }); // Enviar productos vacíos si ocurre un error
  }
});

router.post("/agregarCarrito", async (req, res) => {
  const { id, cantidad } = req.body;
  const { ID_Usuario } = req.session.user;

  try {
    const agregarProducto = await carrito.ingresarcarrito(
      ID_Usuario,
      parseInt(id), // Convertimos el id a número enteroid,
      parseInt(cantidad) // Convertimos la cantidad
    );
    if (agregarProducto) {
      return res
        .status(200)
        .json({ message: "Producto agregado al carrito exitosamente." });
    } else {
      return res
        .status(400)
        .json({ message: "El producto ya se encuentra en el carrito." });
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res
      .status(500)
      .json({ message: "Error al agregar producto al carrito." });
  }
});

router.delete("/eliminarCarrito", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res
      .status(401)
      .json({ message: "Debes iniciar sesión para realizar esta acción." });
  }

  const { id } = req.body;
  const { ID_Usuario } = req.session.user;

  try {
    const eliminarProducto = await carrito.eliminarProducto(
      parseInt(id),
      ID_Usuario
    );
    if (eliminarProducto) {
      return res
        .status(200)
        .json({ message: "Producto eliminado del carrito exitosamente." });
    } else {
      return res
        .status(400)
        .json({ message: "El producto no se encuentra en el carrito." });
    }
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    return res
      .status(500)
      .json({ message: "Error al eliminar producto del carrito." });
  }
});

module.exports = router;
