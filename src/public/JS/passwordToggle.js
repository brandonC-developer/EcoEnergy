// Function to toggle password visibility
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
