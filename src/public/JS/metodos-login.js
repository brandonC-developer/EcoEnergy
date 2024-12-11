function confirmarClave() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("psw").value;
  const confirmPassword = document.getElementById("confirmPsw").value;

  console.log(email, password, confirmPassword);
  // Verifica si ambos campos de contraseña están completos
  if (password !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Las contraseñas no coinciden. Por favor, verifique.",
    });
    return false; // Detiene el envío del formulario
  } else if (password === confirmPassword) {
    enviarDatos(email);
  }
  return false;
}

async function enviarDatos(email) {
  try {
    const cedula = document.getElementById("cedula").value;
    const psw = document.getElementById("psw").value;

    // Envío del correo para generar el token
    const enviarCorreoResponse = await fetch(
      `/user/enviarCorreo?correo=${email}`
    );
    const result = await enviarCorreoResponse.json();

    if (!enviarCorreoResponse.ok) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          result.message ||
          "Error al enviar el correo de verificación. Intente de nuevo.",
      });
      return false;
    }

    // Solicita al usuario que ingrese el token recibido
    const { value: tokenIngresado } = await Swal.fire({
      title: "Ingrese el token",
      input: "text",
      inputLabel: "Revisa tu correo",
      inputPlaceholder: "Escribe el token aquí",
      showCancelButton: true,
    });

    if (!tokenIngresado) {
      Swal.fire({
        icon: "warning",
        title: "Cancelado",
        text: "Debe ingresar el token para continuar.",
      });
      return false;
    }

    // Verifica el token ingresado
    const response = await fetch(`/user/verificarToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenIngresado, email, cedula, psw }),
    });

    const verificationResult = await response.json();

    // Muestra el mensaje de verificación
    Swal.fire({
      icon: verificationResult.success ? "success" : "error",
      title: verificationResult.success ? "Éxito" : "Error",
      text: verificationResult.message,
    });

    // Si la verificación es exitosa, redirige al usuario
    if (verificationResult.success && verificationResult.redirectUrl) {
      window.location.href = verificationResult.redirectUrl;
    }

    return verificationResult.success;
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Ocurrió un error. Por favor, intente de nuevo. ${error}`,
    });
    return false;
  }
}

async function verificacionCaptcha(event) {
  var response = grecaptcha.getResponse();
  event.preventDefault();
  if (response.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Captcha no verificado",
      text: "Debes verificar el captcha para continuar.",
    });
    return false;
  } else {
    return true;
  }
}
