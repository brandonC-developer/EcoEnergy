const express = require("express");
const router = express.Router();
const axios = require("axios");
let db = require("./db");
const bcrypt = require("bcrypt");
// const { login, verificarToken, enviarToken } = require("../public/JS/login");
const {
  enviarCorreo,
  obtenerToken,
} = require("../controllers/register.controller");
//
const {
  ingresarDatos,
  login,
  enviarToken,
  verificarToken,
} = require("../controllers/usuario.controller");
const saltRounds = 10;

//REGISTRO DE USUARIO

router.get("/registro", (req, res) => {
  res.render("register");
});

router.get("/enviarCorreo", async (req, res) => {
  const { correo } = req.query;
  try {
    enviarCorreo(correo, "crear");
    res.json({ message: "Token enviado al correo" }); // Envía una respuesta exitosa
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al enviar el correo de verificación." }); // Manejo de errores
  }
});

router.post("/verificarToken", async (req, res) => {
  const { tokenIngresado, email, cedula, psw } = req.body;
  try {
    const tokenEntr = await obtenerToken(email, tokenIngresado);

    if (tokenEntr == "Valido") {
      res.json({
        success: true,
        redirectUrl: `/user/datospersonal?cedula=${cedula}&correo=${email}&psw=${psw}`,
      });
    } else {
      res.json({
        success: false,
        message: `Ingreso clave Incorrecta. Token esperado: ${tokenEntr}, Token ingresado: ${tokenIngresado}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ocurrió un error al verificar el token. ${error}`,
    });
  }
});

// GET Datos Personal
router.get("/datospersonal", async (req, res) => {
  const { cedula, correo, psw } = req.query;
  try {
    const response = await axios.get(
      `https://apis.gometa.org/cedulas/${cedula}`
    );
    const cedulaData = response.data;

    // Determinar el nombre de la provincia
    const provincias = [
      "San Jose",
      "Alajuela",
      "Cartago",
      "Heredia",
      "Guanacaste",
      "Puntarenas",
      "Limon",
    ];
    const provinciaIndex = parseInt(cedulaData.cedula.charAt(0), 10) - 1;
    const provinciaName = provincias[provinciaIndex];

    res.render("datos-personales", {
      cedula: cedulaData,
      provinciaName: provinciaName,
      correo: correo,
      psw: psw,
    });
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

// POST Datos Personal
router.post("/datospersonal", async (req, res) => {
  const {
    nombre,
    provincia,
    telefono,
    pregunta1,
    respuesta1,
    pregunta2,
    respuesta2,
    pregunta3,
    respuesta3,
    cedula,
    correo,
    psw,
  } = req.body;

  const tipo = "cliente";
  const apellidos = nombre.split(" ").slice(0, -1).join(" ");
  const estado = "activo";
  const nombre1 = nombre.split(" ").slice(-1).join(" ");

  // Consultas de inserción
  const InsertarUsuario = [
    parseInt(cedula),
    nombre1,
    apellidos,
    correo,
    psw,
    parseInt(telefono),
    provincia,
    tipo,
    estado,
    0,
  ];
  const InsertarPreguntas = [
    parseInt(cedula), // Asegúrate de que este ID coincide con el usuario insertado
    parseInt(pregunta1),
    respuesta1,
    parseInt(pregunta2),
    respuesta2,
    parseInt(pregunta3),
    respuesta3,
  ];

  const result = ingresarDatos(InsertarUsuario, InsertarPreguntas);
  if (!result) {
    return res.status(500).send("Error al insertar respuestas.");
  } else {
    res.send(
      '<script>alert("Registro exitoso");window.location.href="/login";</script>'
    );
  }
});

// LOGIN DE USUARIO

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, psw } = req.body;

  const user = await login(email, psw);
  req.session.user = {
    correo: email,
    clave: psw,
    ID_Usuario: user.ID_Usuario,
  };
  if (user) {
    const enviarT = enviarToken(user.Correo, user.Clave, user.ID_Usuario);

    if (!enviarT) {
      res.redirect("/user/login");
    }
    // Redirecciona al usuario a la página del token
    res.redirect(`/user/token`);
  } else {
    res.redirect("/user/login");
  }
});

router.get("/token", (req, res) => {
  const { email, psw } = req.query;
  res.render("token", { email, psw });
});

// Verificar el token proporcionado
router.post("/verificarTokenLogin", async (req, res) => {
  const { correo } = req.session.user;
  const tokenn = req.body.tokenn;
  const r = await verificarToken(correo, tokenn);

  if (tokenn) {
    console.log("Token verificado correctamente");
    return res.redirect("/usuario");
  } else {
    console.log("Token incorrecto o no coincide");
    return res.redirect("/user/login");
  }
});

//POST Reenviar token
router.post("/reenviarToken", (req, res) => {
  const { correo, clave, ID_Usuario } = req.session.user;
  const enviarT = enviarToken(correo, clave, ID_Usuario);

  if (!enviarT) {
    res.render("token");
  }
  res.render("token");
});

module.exports = router;
