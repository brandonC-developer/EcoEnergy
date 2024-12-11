const express = require("express");
const router = express.Router();
const {
  createOrder,
  ruta,
  captureOrder,
  cancelPayment,
} = require("../controllers/pago.controller");

router.get("/", ruta);

router.get("/create-order", createOrder);
router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelPayment);
module.exports = router;
