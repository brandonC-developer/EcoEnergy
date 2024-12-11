// Variables para almacenar los JSON
let provinciasJSON = {};
let empresaJSON = {};

// Cargar el JSON de provincias
fetch("https://api.jsonbin.io/v3/b/6716f49ee41b4d34e446a5b6", {
  headers: {
    "X-Master-Key":
      "$2a$10$C4aDneSfts4r3OLB5enQ1.7AoI97PlWmNjkkI3M1Wx2rfKgC7Ssou",
  },
})
  .then((response) => response.json())
  .then((data) => {
    provinciasJSON = data.record.provincias;
    cargarProvincias();
  })
  .catch((error) =>
    console.error("Error al cargar el JSON de provincias:", error)
  );

// Cargar el JSON de empresas
fetch("http://localhost:7000/api/empresa")
  .then((response) => response.json())
  .then((data) => {
    empresaJSON = data.Empresas;
    cargarEmpresa();
  })
  .catch((error) =>
    console.error("Error al cargar el JSON de empresas:", error)
  );

// Función para cargar provincias en un select
function cargarProvincias() {
  const provinciasSelect = document.getElementById("provincias");
  for (let id in provinciasJSON) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = provinciasJSON[id].nombre;
    provinciasSelect.appendChild(option);
  }
}

// Actualizar cantones cuando se selecciona una provincia
function actualizarCantones() {
  const provinciaId = document.getElementById("provincias").value;
  const cantonesSelect = document.getElementById("cantones");
  cantonesSelect.innerHTML = '<option value="">Seleccione un cantón</option>';

  if (provinciaId) {
    const cantones = provinciasJSON[provinciaId].cantones;
    for (let id in cantones) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = cantones[id].nombre;
      cantonesSelect.appendChild(option);
    }
  }
}

// Actualizar los distritos cuando se selecciona un cantón
function actualizarDistritos() {
  const provinciaId = document.getElementById("provincias").value;
  const cantonId = document.getElementById("cantones").value;
  const distritosSelect = document.getElementById("distritos");
  distritosSelect.innerHTML =
    '<option value="">Seleccione un distrito</option>';

  if (provinciaId && cantonId) {
    const distritos = provinciasJSON[provinciaId].cantones[cantonId].distritos;
    for (let id in distritos) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = distritos[id];
      distritosSelect.appendChild(option);
    }
  }
}

// Cargar empresas en el select
function cargarEmpresa() {
  const empresaSelect = document.getElementById("empresa");
  empresaJSON.forEach((empresa) => {
    const option = document.createElement("option");
    option.value = empresa.nombre; // Usa el nombre como valor
    option.textContent = empresa.nombre;
    empresaSelect.appendChild(option);
  });
}

// Actualizar tarifas de la empresa seleccionada
function actualizarTarifa() {
  const empresaId = document.getElementById("empresa").value;
  const tarifaSelect = document.getElementById("tipoTarifa");
  tarifaSelect.innerHTML = '<option value="">Seleccione un bloque</option>';

  if (empresaId) {
    const url = `http://localhost:7000/api/empresa/tarifa/${empresaId}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.Tarifas && data.Tarifas.length > 0) {
          data.Tarifas.forEach((tarifa) => {
            const option = document.createElement("option");
            option.value = tarifa.bloque; // Usamos el bloque como valor
            option.textContent = `${tarifa.bloque} - ₡${tarifa.tarifa}`;
            tarifaSelect.appendChild(option);
          });
        } else {
          tarifaSelect.innerHTML =
            '<option value="">No hay tarifas disponibles</option>';
        }
      })
      .catch((error) =>
        console.error("Error al obtener las tarifas de la empresa:", error)
      );
  }
}

// Mostrar tarifa seleccionada
function actualizarPrecio() {
  console.log("Tarifa seleccionada");
  const tipoTarifa = document.getElementById("tipoTarifa").value;
  const tarifasInput = document.getElementById("tarifa");
  const empresaId = document.getElementById("empresa").value;
  const consumo = document.getElementById("consumo");

  tarifasInput.innerHTML = ""; // Limpiar contenido anterior
  console.log("Tarifa seleccionada:", tipoTarifa, empresaId);
  if (tipoTarifa && empresaId) {
    const url = `http://localhost:7000/api/empresa/tarifa/${empresaId}`;
    console.log("URL llamada:", url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const tarifaEncontrada = data.Tarifas.find(
          (tarifa) => tarifa.bloque === tipoTarifa
        );
        console.log("Tarifa encontrada:", tarifaEncontrada);
        if (tarifaEncontrada) {
          if (tarifaEncontrada) {
            tarifasInput.value = tarifaEncontrada.tarifa; // Actualiza el valor del input existente
            consumo.disabled = tarifaEncontrada.tarifa > 1000;
          } else {
            tarifasInput.value = ""; // Limpia el campo si no se encuentra tarifa
            alert("No se encontró la tarifa para el bloque seleccionado.");
          }
        } else {
          tarifasInput.innerHTML =
            "<p>No se encontró la tarifa para el bloque seleccionado.</p>";
        }
      })
      .catch((error) => {
        console.error("Error al obtener las tarifas:", error);
        tarifasInput.innerHTML =
          "<p>Error al obtener las tarifas. Intente de nuevo.</p>";
      });
  } else {
    tarifasInput.innerHTML = "<p>Seleccione una empresa válida.</p>";
  }
}
