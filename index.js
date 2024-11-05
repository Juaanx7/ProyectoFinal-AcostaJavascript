document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("prestamo-form");
  const resultadoDiv = document.getElementById("resultado");
  const montoInput = document.getElementById("monto");
  const cuotasInput = document.getElementById("cuotas");

  // Cargar datos de localStorage al cargar la página
  cargarDatosDeStorage();

  form.addEventListener("submit", function (event) {
      event.preventDefault();
      calcularPrestamo();
  });

  montoInput.addEventListener("input", validarMonto);
  cuotasInput.addEventListener("input", validarCuotas);

  function cargarDatosDeStorage() {
      const datosGuardados = JSON.parse(localStorage.getItem("prestamo"));

      if (datosGuardados) {
          montoInput.value = datosGuardados.monto;
          cuotasInput.value = datosGuardados.cuotas;
          mostrarResultados(datosGuardados.arrayCuotas, datosGuardados.devolucionTotal);
      }
  }

  function calcularPrestamo() {
      const monto = Number(montoInput.value);
      const cuotas = Number(cuotasInput.value);

      if (cuotas > 12) {
          resultadoDiv.innerHTML = "<p>¡Superó el máximo de cuotas permitido!</p>";
          cambiarEstiloInput(cuotasInput, false);
          return;
      }

      cambiarEstiloInput(cuotasInput, true); // Cambia a azul si es correcto

      let tasaInteres = calculoInteres(cuotas);
      let precioCuota = calculoCuotas(monto, tasaInteres, cuotas);
      let devolucionTotal = devolucion(precioCuota, cuotas);

      let arrayCuotas = [];
      for (let i = 1; i <= cuotas; i++) {
          arrayCuotas.push({
              numeroCuota: i,
              monto: precioCuota.toFixed(2)
          });
      }
      mostrarResultados(arrayCuotas, devolucionTotal);

      // Guardar datos en localStorage
      guardarDatosEnStorage(monto, cuotas, arrayCuotas, devolucionTotal);
  }

  function guardarDatosEnStorage(monto, cuotas, arrayCuotas, devolucionTotal) {
      const datos = {
          monto: monto,
          cuotas: cuotas,
          arrayCuotas: arrayCuotas,
          devolucionTotal: devolucionTotal
      };
      localStorage.setItem("prestamo", JSON.stringify(datos));
  }

  function cambiarEstiloInput(input, esValido) {
      input.style.borderColor = esValido ? 'blue' : 'red';
  }

  function validarMonto() {
      const monto = Number(montoInput.value);
      // Validar que el monto sea mayor que 0
      if (monto > 0) {
          cambiarEstiloInput(montoInput, true);
      } else {
          cambiarEstiloInput(montoInput, false);
      }
  }

  function validarCuotas() {
      const cuotas = Number(cuotasInput.value);
      // Validar que las cuotas estén dentro del rango permitido
      if (cuotas > 0 && cuotas <= 12) {
          cambiarEstiloInput(cuotasInput, true);
      } else {
          cambiarEstiloInput(cuotasInput, false);
      }
  }

  function mostrarResultados(cuotas, total) {
      resultadoDiv.innerHTML = '';

      cuotas.forEach(cuota => {
          const cuotaDiv = document.createElement('div');
          cuotaDiv.textContent = `Cuota número: ${cuota.numeroCuota} - Monto de cuota: $${cuota.monto}`;
          resultadoDiv.appendChild(cuotaDiv);
      });

      const totalDiv = document.createElement('div');
      totalDiv.innerHTML = `<strong>Total a devolver: $${total.toFixed(2)}</strong>`;
      resultadoDiv.appendChild(totalDiv);
  }

  // Funciones para calcular la tasa de interés, el monto de cada cuota y el total a devolver
  function calculoInteres(cuotas) {
      let tasaInteres = 0;
      if (cuotas <= 3) {
          tasaInteres = 0.30;  // 30% de interés
      } else if (cuotas <= 6) {
          tasaInteres = 0.60;  // 60% de interés
      } else if (cuotas <= 12) {
          tasaInteres = 0.90;  // 90% de interés
      }
      return tasaInteres;
  }

  function calculoCuotas(monto, tasaInteres, cuotas) {
      let interes = monto * tasaInteres; 
      let precioCuota = (monto + interes) / cuotas;
      return precioCuota;
  }

  function devolucion(precioCuota, cuotas) {    
      let total = precioCuota * cuotas;
      return total;
  }
});

