const catalogo = require("../models/Catalogo");
const usuario = require("../models/Usuario");

async function obtenerProductos() {
  try {
    const response = await catalogo.obtenerProductos("GET", "catalogo");
    return response.catalogo;
  } catch (error) {
    console.log("Error al obtener productos:", error);
    throw error;
  }
}
async function producto(id) {
  try {
    const response = await usuario.verificarlogin("catalogo", "GET", id);
    return response.producto;
  } catch (error) {
    console.log("Error al obtener producto:", error);
    throw error;
  }
}

module.exports = { obtenerProductos, producto };
