const nodemailer = require("nodemailer");
const db = require("../routes/db");
const bcrypt = require("bcrypt");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "circuit.city.contact@gmail.com",
    pass: "dzpx oxan wsym ceoo", // Asegúrate de proteger esta clave en un entorno seguro
  },
});

const saltRounds = 10;

// Obtener el token generado sin enviar correo
function obtenerPregunta(id) {
  return new Promise((resolve, reject) => {
    db.query(
      "CALL Recuperar(?,?,?,?)",
      [id, "", "pregunta", ""],
      function (error, tokenResults) {
        if (error) {
          console.error("Error en la consulta:", error);
          reject("Error al generar el token");
        } else if (tokenResults[0] && tokenResults[0].length > 0) {
          const preguntaRec = tokenResults[0][0].pregunta;
          console.log(preguntaRec);
          resolve(preguntaRec); // Devuelve el token
        } else {
          reject("Token no encontrado");
        }
      }
    );
  });
}
async function cambiarClave(id, clave) {
  try {
    // Hash the password
    const nuevaClave = await bcrypt.hash(clave, saltRounds);
    console.log(id, clave);
    // Return a promise that resolves or rejects based on the query result
    return new Promise((resolve, reject) => {
      db.query(
        "CALL Recuperar(?,?,?,?)",
        [id, "", "cambiarClave", nuevaClave],
        function (error, tokenResults) {
          if (error) {
            console.error("Error en la consulta:", error);
            reject(new Error("Error al cambiar clave en la base de datos"));
          } else if (tokenResults[0] && tokenResults[0].length > 0) {
            resolve("Cambio de clave exitoso");
          } else {
            reject(new Error("Usuario no existe"));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error al encriptar la clave:", error);
    throw new Error("Error al encriptar la clave");
  }
}

function verificarRespuesta(id, pregunta) {
  return new Promise((resolve, reject) => {
    db.query(
      "CALL Recuperar(?,?,?,?)",
      [id, pregunta, "respuesta", ""],
      function (error, tokenResults) {
        if (error) {
          console.error("Error en la consulta:", error);
          reject("Error al generar el token");
        } else if (tokenResults[0] && tokenResults[0].length > 0) {
          const respuestadb = tokenResults[0][0].respuesta;
          resolve(respuestadb); // Devuelve el token
        } else {
          reject("Token no encontrado");
        }
      }
    );
  });
}

module.exports = { obtenerPregunta, verificarRespuesta, cambiarClave };
