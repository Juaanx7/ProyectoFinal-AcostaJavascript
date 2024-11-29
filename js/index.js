const form = document.getElementById("prestamo-form");
const resultadoDiv = document.getElementById("resultado");
const montoInput = document.getElementById("monto");
const cuotasInput = document.getElementById("cuotas");
const historialContainer = document.getElementById("historial-container");

// Se cargan los datos de localStorage
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
    mostrarResultados(
      datosGuardados.arrayCuotas,
      datosGuardados.devolucionTotal
    );
  }

  mostrarHistorial(); // Mostrar historial al cargar la página
}

function calcularPrestamo() {
  const monto = Number(montoInput.value);
  const cuotas = Number(cuotasInput.value);

  if (cuotas > 12) {
    resultadoDiv.innerHTML = "<p>¡Superó el máximo de cuotas permitido!</p>";
    cambiarEstiloInput(cuotasInput, false);

    // Mostrar notificación de error con Toastify
    Toastify({
      text: "¡Superó el máximo de cuotas permitido!",
      duration: 3000,
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc3a0)"
      }
    }).showToast();

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
      monto: precioCuota.toFixed(2),
    });
  }
  mostrarResultados(arrayCuotas, devolucionTotal);

  // Guarda datos en el localStorage
  guardarDatosEnStorage(monto, cuotas, arrayCuotas, devolucionTotal);
  agregarAlHistorial(monto, cuotas, precioCuota, devolucionTotal);

  // Mostrar notificación de éxito con Toastify
  Toastify({
    text: "Préstamo calculado correctamente",
    duration: 3000,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)"
    }
  }).showToast();
}

function guardarDatosEnStorage(monto, cuotas, arrayCuotas, devolucionTotal) {
  const datos = {
    monto: monto,
    cuotas: cuotas,
    arrayCuotas: arrayCuotas,
    devolucionTotal: devolucionTotal,
  };
  localStorage.setItem("prestamo", JSON.stringify(datos));
}

function cambiarEstiloInput(input, esValido) {
  input.style.borderColor = esValido ? "blue" : "red";
}

function validarMonto() {
  const monto = Number(montoInput.value);
  // Valida que el monto sea mayor que 0
  if (monto > 0) {
    cambiarEstiloInput(montoInput, true);
  } else {
    cambiarEstiloInput(montoInput, false);
  }
}

function validarCuotas() {
  const cuotas = Number(cuotasInput.value);
  // Valida que las cuotas estén dentro del rango
  if (cuotas > 0 && cuotas <= 12) {
    cambiarEstiloInput(cuotasInput, true);
  } else {
    cambiarEstiloInput(cuotasInput, false);
  }
}

function mostrarResultados(cuotas, total) {
  const resultadoContent = document.getElementById("resultado-content");

  // Verificar si el elemento existe
  if (!resultadoContent) {
    console.error("Error: 'resultado-content' no se encuentra en el DOM.");
    return;
  }

  // Limpiar el contenido previo
  resultadoContent.innerHTML = "";

  // Muestra el monto de cada cuota
  const montoCuotaDiv = document.createElement("div");
  montoCuotaDiv.textContent = `Monto de cada cuota: $${cuotas[0].monto}`;
  resultadoContent.appendChild(montoCuotaDiv);

  // Muestra el total a devolver
  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `<strong>Total a devolver: $${total.toFixed(
    2
  )}</strong>`;
  resultadoContent.appendChild(totalDiv);
}

function agregarAlHistorial(monto, cuotas, precioCuota, devolucionTotal) {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];

  // Agrega un nuevo cálculo al historial
  historial.push({ monto, cuotas, precioCuota, devolucionTotal });

  // Guarda el historial actualizado en localStorage
  localStorage.setItem("historial", JSON.stringify(historial));

  mostrarHistorial(); // Actualiza el historial en pantalla
}

function mostrarHistorial() {
  // Limpia el historial actual
  historialContainer.innerHTML = "";

  const historial = JSON.parse(localStorage.getItem("historial")) || [];

  if (historial.length > 0) {
    const historialDiv = document.createElement("div");
    historial.forEach((item) => {
      const historialItem = document.createElement("div");
      historialItem.classList.add("historial-item");
      historialItem.innerHTML = `
                <p><strong>Monto:</strong> $${
                  item.monto
                } - <strong>Cuotas:</strong> ${
        item.cuotas
      } - <strong>Total a devolver:</strong> $${item.devolucionTotal.toFixed(
        2
      )}</p>
            `;
      historialDiv.appendChild(historialItem);
    });

    historialContainer.appendChild(historialDiv);

    // Crear botón para borrar historial
    const borrarHistorialBtn = document.createElement("button");
    borrarHistorialBtn.textContent = "Borrar historial";
    borrarHistorialBtn.classList.add("btn", "btn-danger");
    borrarHistorialBtn.addEventListener("click", borrarHistorial);
    historialContainer.appendChild(borrarHistorialBtn);
  } else {
    historialContainer.innerHTML = "<p>No hay cálculos previos.</p>";
  }
}

function borrarHistorial() {
  localStorage.removeItem("historial");
  mostrarHistorial(); // Vuelve a mostrar el historial vacío
}

function calculoInteres(cuotas) {
  let tasaInteres = 0;
  if (cuotas <= 3) {
    tasaInteres = 0.3; // 30% de interés
  } else if (cuotas <= 6) {
    tasaInteres = 0.6; // 60% de interés
  } else if (cuotas <= 12) {
    tasaInteres = 0.9; // 90% de interés
  }
  return tasaInteres;
}

function calculoCuotas(monto, tasaInteres, cuotas) {
  let interes = monto * tasaInteres;
  let precioCuota = (monto + interes) / cuotas;
  return precioCuota;
}

function devolucion(precioCuota, cuotas) {
  return precioCuota * cuotas;
}
