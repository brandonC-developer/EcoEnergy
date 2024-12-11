const express = require("express");
const router = express.Router();
const axios = require("axios");
let db = require("./db");
const verificarAutenticacion = require("../middlewares/autenticacion");

router.get("/", verificarAutenticacion,(req, res) => {
  res.render("principal-user");
});

router.get("/calculadora", verificarAutenticacion,(req, res) => {
  res.render("calculadora");
});
// Logout route
router.get("/logout", (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while logging out:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    // Optionally clear cookies if they were used for token storage
    res.clearCookie("connect.sid"); // Cookie name depends on your session config
    // Redirect to login or homepage
    res.redirect("/login"); // Replace with your login route
  });
});

module.exports = router;
