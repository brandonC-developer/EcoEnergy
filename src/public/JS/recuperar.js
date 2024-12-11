// Función para verificar el CAPTCHA y cargar la pregunta
async function verificacionCaptcha(event) {
  event.preventDefault(); // Evita el envío del formulario y la recarga de la página

  // Obtiene la respuesta del reCAPTCHA
  var response = grecaptcha.getResponse();
  if (response.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Captcha no verificado",
      text: "Por favor, verifica el CAPTCHA antes de continuar.",
    });
    return false; // Evitar que el formulario se envíe si el captcha no está verificado
  } else {
    // CAPTCHA verificado, procede a cargar la pregunta
    return await cargarPregunta(); // Espera a que cargarPregunta termine
  }
}

// Función para cargar la pregunta de recuperación
async function cargarPregunta() {
  try {
    const cedula = document.getElementById("cedula").value;

    // Realiza una solicitud GET al endpoint de Express con el parámetro 'cedula'
    const obtenerPreguntaResponse = await fetch(
      `/recuperar/obtenerPregunta?cedula=${cedula}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    // Verifica si la solicitud fue exitosa
    if (!obtenerPreguntaResponse.ok) {
      const errorData = await obtenerPreguntaResponse.json();
      throw new Error(
        errorData.message || "No se pudo cargar la pregunta de recuperación."
      );
    }

    // Obtén la pregunta del JSON de la respuesta
    const data = await obtenerPreguntaResponse.json();
    const pregunta = data.pregunta;

    if (!pregunta) {
      Swal.fire({
        icon: "info",
        title: "Sin pregunta de recuperación",
        text: "No se encontró una pregunta de recuperación para la cédula proporcionada.",
      });
      return false;
    }

    // Solicita la respuesta del usuario
    const { value: respUsuario } = await Swal.fire({
      title: "Pregunta de recuperación",
      input: "text",
      inputLabel: pregunta,
      inputPlaceholder: "Escribe tu respuesta aquí",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
    });
    console.log(respUsuario);
    // Verifica si el usuario ingresó una respuesta
    if (!respUsuario) {
      Swal.fire({
        icon: "warning",
        title: "Sin respuesta",
        text: "No se ingresó ninguna respuesta.",
      });
      return false; // Evitar el envío si no hay respuesta
    }

    // Envía la respuesta al servidor para verificarla
    const verificarResponse = await fetch(`/recuperar/verificarPregunta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cedula,
        pregunta,
        respUsuario,
      }),
    });

    // Verifica la respuesta del servidor
    if (!verificarResponse.ok) {
      const errorData = await verificarResponse.json();
      throw new Error(
        errorData.message || "Error en la verificación de la respuesta."
      );
    }

    const verificarResult = await verificarResponse.json();

    // Muestra el mensaje de verificación
    Swal.fire({
      icon: verificarResult.success ? "success" : "error",
      title: verificarResult.success ? "Verificación exitosa" : "Error",
      text: verificarResult.message,
    });

    // Redirige si la verificación es exitosa
    if (verificarResult.success && verificarResult.redirectUrl) {
      window.location.href = verificarResult.redirectUrl;
    }

    return verificarResult.success;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Ocurrió un error. Por favor, intente de nuevo`,
    });
    return false;
  }
}

function togglePasswordVisibility(fieldId) {
  const field = document.getElementById(fieldId);
  const button = field.nextElementSibling;
  if (field.type === "password") {
    field.type = "text";
    button.innerText = "Ocultar";
  } else {
    field.type = "password";
    button.innerText = "Mostrar";
  }
}

function confirmarClave(event) {
  event.preventDefault(); // Prevent form submission

  const password = document.getElementById("psw").value;
  const confirmPassword = document.getElementById("confirmPsw").value;

  if (!password || !confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, complete ambos campos de contraseña.",
    });
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Contraseñas no coinciden",
      text: "Las contraseñas no coinciden. Por favor, verifique.",
    });
    return;
  }

  cambiarClave();
}

async function cambiarClave() {
  const cedula = document.getElementById("cedula").value;
  const psw = document.getElementById("psw").value;

  if (!cedula || !psw) {
    Swal.fire({
      icon: "warning",
      title: "Datos incompletos",
      text: "Identificación o contraseña no proporcionada.",
    });
    return;
  }

  try {
    const response = await fetch(`/form_cambiar_clave?cedula=${cedula}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ psw, cedula }),
    });

    const data = await response.json();

    Swal.fire({
      icon: response.ok ? "success" : "error",
      title: response.ok ? "Éxito" : "Error",
      text: data.message,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Error al cambiar de clave: ${error.message}`,
    });
  }
}

module.exports = {
  confirmarClave,
  togglePasswordVisibility,
  verificacionCaptcha,
};
