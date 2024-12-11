const axios = require("axios");
const fetch = require("node-fetch");
class Carrito {
  static async cargarCarrito(endpoint, method = "GET", id = null) {
    // Construir la URL con el parámetro directamente
    let url = `http://localhost:8000/api/${endpoint}`;

    // Si el parámetro 'email' está presente, añadirlo a la URL
    if (id) {
      url += `/${id}`;
    }

    const options = {
      method,
      url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error en la API:", error.response.data);
        throw new Error(`Error ${error.response.statusText}`);
      } else {
        console.log("Error al consumir API: ", error.message);
        throw error;
      }
    }
  }
  static async registararCarrito(endpoint, data) {
    const url = `http://localhost:8000/api/${endpoint}`;
    console.log(data);
    const options = {
      method: "POST",
      url,
      headers: {
        "Content-Type": "application/json",
      },
      data, // Agregamos los datos a enviar en el cuerpo de la solicitud
    };
    console.log(options);
    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error en la API:", error.response.data);
        throw new Error(`Error ${error.response.statusText}`);
      } else {
        console.error("Error al consumir API: ", error.message);
        throw error;
      }
    }
  }

  static async eliminarProducto(endpoint, idProducto, idUsuario) {
    const url = `http://localhost:8000/api/${endpoint}/${idProducto}/${idUsuario}`;

    const options = {
      method: "DELETE",
      url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error en la API:", error.response.data);
        throw new Error(`Error ${error.response.statusText}`);
      } else {
        console.error("Error al consumir API: ", error.message);
        throw error;
      }
    }
  }
}
module.exports = Carrito;
