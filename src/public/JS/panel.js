function cambiarPanel(numeroPanel) {
  // Ocultar todos los paneles
  const panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => panel.classList.remove("active"));

  // Mostrar el panel seleccionado
  const panelToShow = document.getElementById(`panel${numeroPanel}`);
  if (panelToShow) {
    panelToShow.classList.add("active");
  }
}
