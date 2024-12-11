const nodemailer = require("nodemailer");
const db = require("../routes/db");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "circuit.city.contact@gmail.com",
    pass: "dzpx oxan wsym ceoo", // Asegúrate de proteger esta clave en un entorno seguro
  },
});

// Enviar correo y generar token
function enviarCorreo(correo) {
  return new Promise((resolve, reject) => {
    db.query(
      "CALL GenerarTokenTemporal(?, ?, ?)",
      [correo, "crear",""],
      function (error, tokenResults) {
        if (error) {
          console.error("Error en la consulta:", error);
          reject("Error al generar el token");
        } else if (tokenResults[0] && tokenResults[0].length > 0) {
          const tokenEntr = tokenResults[0][0].token_generado;

          // Configura el correo
          const mailOptions = {
            from: "circuit.city.contact@gmail.com",
            to: correo,
            subject: "Tu código de un solo uso",
            text: `Hola ${correo}:\n\nRecibimos tu solicitud de un código de un solo uso para usarlo con tu cuenta.\nTu código de un solo uso es: ${tokenEntr}\n`,
          };

          // Envía el correo
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.error("Error al enviar el correo:", error);
              reject("Error al enviar el correo");
            } else {
              console.log("Correo enviado con el token: " + tokenEntr);
              resolve(tokenEntr); // Devuelve el token si el envío fue exitoso
            }
          });
        } else {
          reject("Error al generar el token");
        }
      }
    );
  });
}

// Obtener el token generado sin enviar correo
function obtenerToken(correo,token) {
  return new Promise((resolve, reject) => {
    db.query(
      "CALL GenerarTokenTemporal(?, ?, ?)",
      [correo, "ver",token],
      function (error, tokenResults) {
        if (error) {
          console.error("Error en la consulta:", error);
          reject("Error al generar el token");
        } else if (tokenResults[0] && tokenResults[0].length > 0) {
          resolve(tokenResults[0][0].resultado); // Devuelve el token
        } else {
          reject("Token no encontrado");
        }
      }
    );
  });
}

module.exports = { enviarCorreo, obtenerToken };
