const path = require("path");
const { config } = require("dotenv");
config();
config({ path: path.resolve(__dirname, "../.env") });const port = 3000;
const host = "http://localhost:" + port;


const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

module.exports = { port, host, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API };
