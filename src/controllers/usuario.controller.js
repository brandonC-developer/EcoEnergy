const usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "circuit.city.contact@gmail.com",
    pass: "dzpx oxan wsym ceoo",
  },
});

const saltRounds = 10;

async function ingresarDatos(dataUsuario, dataPreguntas) {
  try {
    const cryp_pas = await bcrypt.hash(dataUsuario[4], saltRounds);
    const cryp_resp1 = await bcrypt.hash(dataPreguntas[2], saltRounds);
    const cryp_resp2 = await bcrypt.hash(dataPreguntas[4], saltRounds);
    const cryp_resp3 = await bcrypt.hash(dataPreguntas[6], saltRounds);

    const dataU = {
      ID_Usuario: dataUsuario[0],
      Nombre: `${dataUsuario[1]}`,
      apellido: `${dataUsuario[2]}`,
      Correo: `${dataUsuario[3]}`,
      Clave: `${cryp_pas}`,
      telefono: dataUsuario[5],
      provincia: `${dataUsuario[6]}`,
      Tipo: `${dataUsuario[7]}`,
      estado: `${dataUsuario[8]}`,
      intentos_fallidos: dataUsuario[9],
    };
    // Hashear la contraseña antes de guardarla
    console.log("Datos Usuario enviados:", dataU);

    const dataP = {
      id: `${dataPreguntas[0]}`,
      pr1: `${dataPreguntas[1]}`,
      rp1: `${cryp_resp1}`,
      pr2: `${dataPreguntas[3]}`,
      rp2: `${cryp_resp2}`,
      pr3: `${dataPreguntas[5]}`,
      rp3: `${cryp_resp3}`,
    };
    console.log("Datos Preguntas enviados:", dataP);

    const resultPersonal = await usuario.datospersonal(
      "insert",
      "POST",
      dataU,
      "usuario"
    );
    const resultPreguntas = await usuario.datospersonal(
      "insert",
      "POST",
      dataP,
      "pregunta"
    );

    if (resultPersonal && resultPreguntas) {
      console.log("Datos ingresados con exito", resultPersonal);
      console.log("Datos ingresados con exito", resultPreguntas);
      return true;
    } else {
      console.log("Error: No se puedo registrar Usuario");
      return false;
    }
  } catch (error) {
    console.log("Error al ingresar datos: ", error);
  }
}

async function login(email, psw) {
  try {
    console.log("Email ingresado:", email);

    // Llamada a la API para verificar login
    const response = await usuario.verificarlogin("login", "GET", email);
    const r = response.usuario
    console.log(r)
    // Verificación de la respuesta
    if (!r || !Array.isArray(r) || r.length === 0) {
      console.log("Usuario no encontrado");
      return false;
    }

    // Acceder al primer usuario en la respuesta
    const user = r[0];

    // Verificar tipos de datos y contenido
    console.log("Tipo de user.Clave:", typeof user.Clave, "Valor:", user.Clave);
    console.log("Tipo de psw:", typeof psw, "Valor:", psw);

    // Limpiar espacios de psw
    psw = psw.trim();

    // Comparar la contraseña ingresada con la clave almacenada
    const passwordMatch = await bcrypt.compare(psw, user.Clave);
    console.log("Resultado de bcrypt.compare:", passwordMatch);

    if (!passwordMatch) {
      console.log("Credenciales incorrectas");
      return false;
    }

    console.log("Bienvenido usuario");
    return user;
  } catch (error) {
    console.log("Error al validar Usuario:", error);
  }
}

async function enviarToken(correo, clave, id) {
  if (!correo || !clave || !id) {
    console.log("Valores de usuario inválidos:", { correo, clave, id });
    return false;
  }
  const response = await usuario.verificarlogin("token", "GET", correo);
  const r =response.token
  console.log(r[0].num_token)
  if (response) {
    const token = r[0].num_token;

    let mailOptions = {
      from: "circuit.city.contact@gmail.com",
      to: correo,
      subject: "Tu código de un solo uso",
      text: `Hola ${correo}: \n 
            Recibimos tu solicitud de un código de un solo uso para usarlo con tu cuenta.\n
            Tu código de un solo uso es: ${token}\n`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log("Email enviado: " + info.response);
        // Redirecciona al usuario a la página del token
        return true;
      }
    });
  } else {
    console.log("Error al generar el token");
    return false;
  }
}
async function verificarToken(correo, tokenn) {
  if (!correo) {
    console.log("Token ingresado inválido:", { correo, clave, id });
    return false;
  }
  const response = await usuario.verificarlogin("verificarToken", "GET", correo);
  const r =response.token;
  const token = r[0].num_token;
  console.log(r[0].num_token)
  if (token == tokenn) {
    console.log("Token verificado con exito");
    return true;
  } else {
    return false;
  }
}
module.exports = { ingresarDatos, login, enviarToken, verificarToken };
