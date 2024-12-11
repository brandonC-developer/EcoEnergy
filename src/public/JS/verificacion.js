const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "circuit.city.contact@gmail.com",
    pass: "dzpx oxan wsym ceoo",
  },
});

router.get("/", (req, res) => {
  res.render("recuperacion");
});

router.post("/verificar", (req, res) => {
  const { correo } = req.body; // Recupera el email del usuario de la sesión

  if (!correo) {
    console.log("Ingrese u correo Valido:", { correo });
    res.status(400).send("Valores de usuario inválidos");
    return;
  }

  db.query(
    "CALL GenerarTokenPersonal(?,?)",
    [correo, "crear"],
    function (error, tokenResults) {
      if (error) {
        console.log("Error en la consulta:", error);
        res.status(500).send("Error en la consulta");
        return;
      }

      if (tokenResults[0] && tokenResults[0].length > 0) {
        const token = tokenResults[0][0].token_temporal;

        let mailOptions = {
          from: "circuit.city.contact@gmail.com",
          to: correo,
          subject: "Verificacion de Correo",
          text: `Hola ${correo}: \n 
                  Recibimos tu solicitud para registrarte .\n
                  Tu código de verificacion es: ${token}\n`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(500).send("Error al enviar el correo");
            return;
          } else {
            console.log("Email enviado: " + info.response);
            // Redirecciona al usuario a la página del token
            res.send("Email enviado: " + info.response);
          }
        });
      } else {
        console.log("Error al generar el token");
        res.send("Error al generar el token");
      }
    }
  );
});

module.exports = router;