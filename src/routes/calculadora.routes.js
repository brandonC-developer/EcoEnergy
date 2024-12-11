const express = require("express");
const router = express.Router();
let db = require("./db");

router.get("/", (req, res) => {
  res.render("calculadora");
});

module.exports = router;
