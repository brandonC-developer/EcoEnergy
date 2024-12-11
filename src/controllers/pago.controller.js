const pago = require("../models/Pago");
const {
  host,
  PAYPAL_API,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
} = require("../routes/config");
const axios = require("axios");
const carrito = require("./carrito.controller");
const baseUrl = {
  sandbox: "https://api-m.sandbox.paypal.com",
};

async function dolar() {
  try {
    const response = await pago.tipoCambio("GET");
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.log("Error al obtener productos:", error);
    throw error;
  }
}

const ruta = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  const { ID_Usuario } = req.session.user;
  try {
    const productosCarrito = await carrito.obtenerProductosCarrito(ID_Usuario);
    const tipoCambio = await dolar();
    const clientId =
      "AcIXa3FffBWC4TMbQcAJx7mdeTRMSAeVObBvps9-d7et2NnUUqye2dZNI1Ye7Mg5Pqu6EEWO17w0Pf4Y";
    res.render("producto/pago", {
      products: productosCarrito || [],
      tipoCambio: tipoCambio,
      clientId: clientId, // Enviamos el JSON tal cual
    });
  } catch (error) {
    console.error("Error al cargar el carrito:", error);

    res.render("producto/catalogo");
  }
};

const createOrder = async (req, res) => {
  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          value: "1.00",
          currency_code: "USD",
        },
      },
    ],
    application_context: {
      brand_name: "Ecoenergy",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${host}/capture-order`,
      cancel_url: `${host}/cancel-order`,
    },
  };

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const {
    data: { access_token },
  } = await axios.post(`${PAYPAL_API}/v1/oauth/token`, params, {
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_CLIENT_SECRET,
    },
  });

  axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
    headers: {},
  });
};

const captureOrder = (req, res) => {
  res.render("producto/capture");
};
const cancelPayment = (req, res) => {
  res.render("producto/cancel");
};

module.exports = {
  dolar,
  cancelPayment,
  captureOrder,
  ruta,
  createOrder,
};
