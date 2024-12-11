const carrito = require("../models/Carrito");
const usuario = require("../models/Usuario");

async function ingresarcarrito(carrito_id, producto_id, cantidad) {
  try {
    const datos = { carrito_id, producto_id, cantidad };
    const carro = await carrito.registararCarrito("carrito", datos);

    if (carro) {
      return carro; // Producto agregado correctamente
    }
    return null; // Producto ya existente o error
  } catch (error) {
    console.error("Error al ingresar producto al carrito:", error);
    throw error;
  }
}

async function obtenerProductosCarrito($id) {
  try {
    const carrito = await usuario.verificarlogin("carrito", "GET", $id);
    console.log(carrito.carrito);
    if (carrito) {
      return carrito.carrito;
    }
    return null;
  } catch (error) {
    console.log("Error al obtener productos del carrito:", error);
    throw error;
  }
}

async function eliminarProducto(idProducto, idUsuario) {
  try {
    const carro = await carrito.eliminarProducto(
      "carrito",
      idProducto,
      idUsuario
    );
    if (carro) {
      return carro;
    }
    return null;
  } catch (error) {
    console.log("Error al ingresar carrito:", error);
    throw error;
  }
}

module.exports = { ingresarcarrito, obtenerProductosCarrito, eliminarProducto };
