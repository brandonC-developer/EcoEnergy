import {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk";

// Configuración de PayPal Client
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
  },
});

const ordersController = new OrdersController(client);

// Crear orden
export const createOrder = async (cart) => {
  const collect = {
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cart.reduce((sum, item) => sum + item.price, 0),
          },
        },
      ],
    },
  };

  try {
    const { body } = await ordersController.ordersCreate(collect);
    return JSON.parse(body);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

// Capturar orden
export const captureOrder = async (orderID) => {
  try {
    const { body } = await ordersController.ordersCapture({ id: orderID });
    return JSON.parse(body);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

module.exports = { createOrder, captureOrder };