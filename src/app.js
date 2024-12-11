//import swal from "sweetalert";
const { port, host } = require("./routes/config");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("path");
const ejs = require("ejs");
const connectDB = require("./routes/db");
const session = require("express-session");

// Conexión a la base de datos
connectDB; // Asegúrate de ejecutar la función para que la conexión se establezca correctamente

// Variables de entorno
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "tu_secreto_aqui", // Use env variable for added security
    resave: false,
    saveUninitialized: false, // Set to false if you only want to save sessions when something is stored
    cookie: {
      maxAge: 60000 * 60 * 5, // Session valid for 24 hours
      secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      sameSite: "strict", // Helps prevent CSRF attacks
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - User Agent: ${req.headers["user-agent"]} - IP: ${req.ip}`
    );
  });
  next();
});

// Importación de las Rutas
const index = require("./routes/index.routes");
const user = require("./routes/user.routes");
const recuperar = require("./routes/recuperar.routes");
const usuario = require("./routes/usuario.routes");
const catalogo = require("./routes/catalogo.routes");
const carrito = require("./routes/carrito.routes");
const pago = require("./routes/pago.routes");

// Configuración
app.set("case sensitive routing", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
///LAYOUTS
app.set(expressLayouts);
app.set("layout-carrito", "producto/layout/layout-carrito");

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use("/", index);
app.use("/user", user);
app.use("/recuperar", recuperar);
app.use("/usuario", usuario);
app.use("/catalogo", catalogo);
app.use("/carrito", carrito);
app.use("/pago", pago);

// Archivos estáticos
app.use("/public", express.static(path.join(__dirname, "public")));

// Iniciar Servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en ${host}`);
});
