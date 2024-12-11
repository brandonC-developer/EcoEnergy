document.addEventListener("DOMContentLoaded", () => {
  const cartCountElement = document.getElementById("cart-count");

  // Simula la carga de la cantidad de productos en el carrito (por ejemplo, desde una API o localStorage)
  function updateCartCount() {
    // Aquí puedes obtener los datos reales, por ahora es un valor simulado
    const cartCount = 3; // Cambia por lógica real (fetch o localStorage)
    cartCountElement.textContent = cartCount;
  }

  updateCartCount();

  // Escuchar eventos para añadir productos al carrito y actualizar el contador
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const currentCount = parseInt(cartCountElement.textContent, 10) || 0;
      cartCountElement.textContent = currentCount + 1;
    });
  });
});
