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
    return false; // Evitar que el formulario se envíe si el CAPTCHA no está verificado
  }

  // Si el CAPTCHA es válido, envía el formulario manualmente
  event.target.submit();
}
