let provinciasJSON = {}; // Variable para almacenar el JSON cargado
let empresaJSON = {};
// Cargar el archivo JSON con Fetch API
fetch("http://localhost:7000/api/empresa")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    empresaJSON = data.record.provincias; // Actualización para trabajar con "provincias" en la estructura
    cargarEmpresa();
  })
  .catch((error) => console.error("Error al cargar el archivo JSON:", error));

// Cargar las provincias en el select
function cargarEmpresa() {
  const provinciasSelect = document.getElementById("empresa");
  for (let id in provinciasJSON) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = provinciasJSON[id].nombre;
    provinciasSelect.appendChild(option);
  }
}

// Actualizar los cantones cuando se selecciona una provincia
function actualizarTarifa() {
  const provinciaId = document.getElementById("empresa").value;
  const cantonesSelect = document.getElementById("tarifa");
  cantonesSelect.innerHTML = '<option value="">Seleccione un cantón</option>'; // Limpiar el selector de cantones
  document.getElementById("distritos").innerHTML =
    '<option value="">Seleccione un distrito</option>'; // Limpiar distritos

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

// // Actualizar los distritos cuando se selecciona un cantón
// function actualizarDistritos() {
//   const provinciaId = document.getElementById("provincias").value;
//   const cantonId = document.getElementById("cantones").value;
//   const distritosSelect = document.getElementById("distritos");
//   distritosSelect.innerHTML =
//     '<option value="">Seleccione un distrito</option>'; // Limpiar el selector de distritos

//   if (provinciaId && cantonId) {
//     const distritos = provinciasJSON[provinciaId].cantones[cantonId].distritos;
//     for (let id in distritos) {
//       const option = document.createElement("option");
//       option.value = id;
//       option.textContent = distritos[id];
//       distritosSelect.appendChild(option);
//     }
//   }
//}
