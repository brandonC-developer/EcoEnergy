const axios = require("axios");
const { application } = require("express");
const fetch = require("node-fetch"); // Si estás en Node.js; en el navegador no es necesario
class Registrar {
  static async datospersonal(endpoint, method = "GET", data = null, ruta) {
    const url = `http://localhost:8000/api/${ruta}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (data && method === "POST") {
      options.body = JSON.stringify(data);
    }
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json(); // Intentar obtener detalles del error en formato JSON
        console.error("Error en la API:", errorData);
        throw new Error(`Error ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.log("Error al consumir API: ", error);
      throw error;
    }
  }

  static async verificarlogin(endpoint, method = "GET", email = null) {
    // Construir la URL con el parámetro directamente
    let url = `http://localhost:8000/api/${endpoint}`;

    // Si el parámetro 'email' está presente, añadirlo a la URL
    if (email) {
      url += `/${email}`;
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
}
module.exports = Registrar;
