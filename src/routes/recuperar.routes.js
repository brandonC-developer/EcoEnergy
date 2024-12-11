const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  obtenerPregunta,
  verificarRespuesta,
  cambiarClave,
} = require("../controllers/recuperar.controller");

router.get("/", (req, res) => {
  res.render("recuperacion");
});
// Endpoint para obtener la pregunta de recuperación
// Endpoint para obtener la pregunta de recuperación
router.get("/obtenerPregunta", async (req, res) => {
  const { cedula } = req.query;
  try {
    const preguntaRec = await obtenerPregunta(cedula);

    if (!preguntaRec) {
      return res.status(404).json({
        message: "Pregunta no encontrada para la cédula proporcionada.",
      });
    }

    res.json({ pregunta: preguntaRec }); // Cambia 'message' a 'pregunta'
  } catch (error) {
    console.log("Error al cargar pregunta de recuperación:", error);
    res
      .status(500)
      .json({ message: `Error al cargar pregunta de recuperación: ${error}` });
  }
});

// Endpoint para verificar la respuesta de la pregunta
router.post("/verificarPregunta", async (req, res) => {
  const { cedula, pregunta, respUsuario } = req.body;
  try {
    const encrResp = await verificarRespuesta(cedula, pregunta); // Obtains the encrypted response
    console.log(respUsuario);
    if (!encrResp) {
      return res.status(404).json({
        success: false,
        message: "Respuesta de seguridad no encontrada.",
      });
    }
    console.log(encrResp);
    const answerMatch = await bcrypt.compare(respUsuario, encrResp);

    if (answerMatch) {
      res.json({
        success: true,
        message: "Respuesta correcta",
        redirectUrl: `/recuperar/cambiarClave?cedula=${cedula}`, // URL with cedula parameter
        data: { cedula }, // Sends cedula as part of a nested data object
      });
    } else {
      res.json({ success: false, message: "Respuesta incorrecta" });
    }
  } catch (error) {
    console.log("Error al verificar pregunta", error);
    res.status(500).json({
      success: false,
      message: `Ocurrió un error al verificar respuesta: ${error}`,
    });
  }
});

router.get("/cambiarClave", async (req, res) => {
  const { cedula } = req.query; // Get cedula from query parameters
  if (cedula) {
    // Render the page and pass the cedula to the EJS template
    res.render("recu-cambiar-clave", { cedula });
  } else {
    // Handle the case where cedula is not provided
    res.status(400).send("Cedula is required");
  }
});

router.post("/form_cambiar_clave", async (req, res) => {
  const { psw, cedula } = req.body;
  try {
    const result = await cambiarClave(cedula, psw);
    res.json({ message: result });
  } catch (error) {
    console.error("Error al cambiar de clave:", error);
    res.status(500).json({
      message: `Error al cambiar de clave: ${
        error.message || "Error desconocido"
      }`,
    });
  }
});

module.exports = router;
