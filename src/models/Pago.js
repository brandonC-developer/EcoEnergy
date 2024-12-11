const fetch = require("node-fetch");

async function tipoCambio(method = "GET", data = null) {
  const url = `http://apis.gometa.org/tdc/tdc.json`;
  const options = {
    method,
    headers: {},
  };

  // Agregar cuerpo de la petición si el método no es GET
  if (method !== "GET" && data) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let errorDetails = {};
      try {
        // Intentar obtener detalles del error
        errorDetails = await response.json();
      } catch (err) {
        console.warn("No se pudo analizar el cuerpo del error como JSON.");
      }
      console.error("Error en la API:", errorDetails);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al consumir la API: ", error.message);
    throw error;
  }
}

module.exports = { tipoCambio };
