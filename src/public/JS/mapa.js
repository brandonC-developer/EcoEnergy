let map; // Variable global para el mapa
let marker; // Variable global para el marcador

// Función para cargar el mapa con coordenadas predeterminadas
function loadDefaultMap() {
  const defaultLat = 9.748917;
  const defaultLng = -83.753428;

  map = L.map("map").setView([defaultLat, defaultLng], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Añadir un marcador inicial por defecto
  marker = L.marker([defaultLat, defaultLng]).addTo(map);
}

// Escucha el evento de submit del formulario
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const country = "Costa Rica";
  const province = $(document.getElementById("provincias"))
    .find("option:selected")
    .text();
  const canton = $(document.getElementById("cantones"))
    .find("option:selected")
    .text();
  const district = $(document.getElementById("distritos"))
    .find("option:selected")
    .text();

  const location = `${district}, ${canton}, ${province}, ${country}`;
  console.log(location);

  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    location
  )}&format=json&countrycodes=CR`;

  fetch(nominatimUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const lat = data[0].lat;
        const lng = data[0].lon;
        updateMap(lat, lng);

        // Muestra la latitud y longitud en los elementos <p>
        document.getElementById("latitude").textContent = `${lat}`;
        document.getElementById("longitude").textContent = `${lng}`;
      } else {
        alert("No se encontraron resultados para esa ubicación.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Función para actualizar el mapa con las coordenadas encontradas
function updateMap(lat, lng) {
  if (map) {
    map.flyTo([lat, lng], 12);
  }

  if (marker) {
    // Si ya existe un marcador, lo movemos
    marker.setLatLng([lat, lng]);
  } else {
    // Si no existe, creamos un nuevo marcador
    marker = L.marker([lat, lng]).addTo(map);
  }
}

// Función para cambiar entre paneles
function cambiarPanel(panelNumber) {
  // Mostrar el panel seleccionado y ocultar los demás
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.remove("active");
  });

  document.getElementById(`panel${panelNumber}`).classList.add("active");

  // Si el panel 2 (donde está el mapa) se activa y el mapa no ha sido inicializado
  if (panelNumber === 2 && !map) {
    loadDefaultMap(); // Iniciar el mapa con coordenadas por defecto
  }
}

// Cargar el mapa por defecto al cargar la página
window.onload = function () {
  loadDefaultMap();
};
