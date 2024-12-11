document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("solarForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Validar entradas
      const area = parseFloat(document.getElementById("area").value);
      const tarifa = parseFloat($("#tarifa").val());
      const consumo = parseFloat($("#consumo").val());
      const latitud = parseFloat($("#latitude").text());
      const longitud = parseFloat($("#longitude").text());

      if (isNaN(area) || area <= 0) {
        alert("Por favor, ingrese un área válida.");
        return;
      }
      if (isNaN(tarifa) || tarifa <= 0) {
        alert("Por favor, ingrese una tarifa válida.");
        return;
      }
      if (isNaN(consumo) || consumo < 0) {
        alert("Por favor, ingrese un consumo válido.");
        return;
      }
      if (isNaN(latitud) || isNaN(longitud)) {
        alert("No se detectó una ubicación válida.");
        return;
      }

      console.log(latitud, longitud, tarifa);

      // Obtener el rango de fechas dinámicamente (último mes)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      const formatFecha = (fecha) =>
        fecha.toISOString().split("T")[0].replace(/-/g, "");

      const start = formatFecha(startDate);
      const end = formatFecha(endDate);

      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,CLRSKY_SFC_SW_DWN,PRECTOT&community=RE&longitude=${longitud}&latitude=${latitud}&start=${start}&end=${end}&format=JSON`;
      console.log(url);

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
          }
          return response.json();
        })
        .then((data) => {
          if (!data || !data.properties) {
            alert("No se encontraron datos para esta ubicación.");
            return;
          }

          const allSkyIrradianceData =
            data.properties.parameter.ALLSKY_SFC_SW_DWN || {};
          const clearSkyIrradianceData =
            data.properties.parameter.CLRSKY_SFC_SW_DWN || {};
          const precipitationData = data.properties.parameter.PRECTOT || {};

          let energiaTotal = 0;

          for (const fecha in allSkyIrradianceData) {
            const irradiancia = allSkyIrradianceData[fecha];
            const irradianciaCieloDespejado = clearSkyIrradianceData[fecha];
            const precipitacion = precipitationData[fecha];

            if (irradiancia !== -999 && precipitacion !== -999) {
              const factorNubosidad =
                irradianciaCieloDespejado > 0
                  ? irradiancia / irradianciaCieloDespejado
                  : 1;

              const eficienciaPrecipitacion =
                precipitacion > 0
                  ? Math.max(0, 0.85 * (1 - precipitacion / 100))
                  : 0.9;

              const energiaDia = calcularEnergia(
                irradiancia,
                area,
                eficienciaPrecipitacion * factorNubosidad
              );
              energiaTotal += energiaDia;
            }
          }

          const consumoEstimado = tarifa * consumo;
          const generadado = parseFloat(
            consumoEstimado - energiaTotal * tarifa
          );
          document.getElementById(
            "result"
          ).innerHTML = `<strong>Promedio generada en el mes paneles:</strong> ${energiaTotal.toFixed(
            2
          )} KWh<br><strong>Tu consumo estimado:</strong> ${consumoEstimado.toFixed(
            2
          )} ₡ <br><strong>Promedio beneficio de paneles estimado:</strong> ${generadado.toFixed(
            2
          )}`;
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
          alert("Ocurrió un error al procesar los datos. Intenta nuevamente.");
        });
    });
});

function calcularEnergia(irradiancia, superficie, eficiencia) {
  return irradiancia * superficie * eficiencia; // Calculo de energía en KWh
}
