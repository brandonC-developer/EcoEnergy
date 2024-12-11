const axios = require("axios");
const fetch = require("node-fetch");
class Token {
  static async getToken(endpoint, method = "GET", correo) {
    const url = `http://localhost:8000/api/${endpoint}`; // Reemplaza con la URL de tu API
    if (correo) {
      url += `/${correo}`; // Reemplaza con la URL de tu API
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
        console.error("Error al consumir API: ", error.message);
        throw error;
      }
    }
  }

  static async verificarToken(endpoint, method = "GET", correo) {
    const url = `http://localhost:8000/api/${endpoint}`; // Reemplaza con la URL de tu API
    if (correo) {
      url += `/${correo}`; // Reemplaza con la URL de tu API
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
        console.error("Error al consumir API: ", error.message);
        throw error;
      }
    }
  }
}

module.exports = Token;
