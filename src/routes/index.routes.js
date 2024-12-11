const express = require("express");
const router = express.Router();
let db = require("./db");
const { route } = require("./calculadora.routes");

router.get("/", (req, res) => {
  res.render("onboarding");
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/nosotros", (req, res) => {
  res.render("nosotros");
});

router.get("/noticias", (req, res) => {
  res.render("vlog");
});

router.get("/cuenta", (req, res) => {
  {}
  res.render("perfil");
});
module.exports = router;
