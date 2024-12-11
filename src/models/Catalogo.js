const fetch = require("node-fetch");

class Catalogo {
  static async obtenerProductos(method = "GET", ruta, data = null) {
    const url = `http://localhost:8000/api/${ruta}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Solo agregar el cuerpo de la petición si no es GET
    if (method && data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json(); // Intentar obtener detalles del error
        console.error("Error en la API:", errorData);
        throw new Error(`Error ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al consumir API: ", error.message);
      throw error;
    }
  }

  // CARRITO
  static async obtenerProductosCarrito(method = "GET", ruta, data = null) {
    const url = `http://localhost:8000/api/${ruta}`;
  }

///////////////~~///////////////////////////////////////
  static async registrarCarrito(method = "GET", ruta, data = null) {
    const url = `http://localhost:8000/api/${ruta}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Solo agregar el cuerpo de la petición si no es GET
    if (method && data === "POST") {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json(); // Intentar obtener detalles del error
        console.error("Error en la API:", errorData);
        throw new Error(`Error ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al consumir API: ", error.message);
      throw error;
    }
  }

}

module.exports = Catalogo;
