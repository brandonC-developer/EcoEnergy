function verificarAutenticacion(req, res, next) {
    // Verifica si el usuario está en la sesión
    if (req.session.user) {
        return next();  // Si el usuario está autenticado, continúa con la siguiente función o ruta
    } else {
        res.redirect("/user/login");  // Si no está autenticado, redirige al login
    }
}

module.exports = verificarAutenticacion;
