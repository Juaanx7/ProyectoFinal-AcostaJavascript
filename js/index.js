// Importa las funciones desde prestamo.js
import { calculoInteres, calculoCuotas, devolucion } from "./prestamo.js";

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
  try {
    const datosGuardados = JSON.parse(localStorage.getItem("prestamo"));
    if (datosGuardados) {
      montoInput.value = datosGuardados.monto;
      cuotasInput.value = datosGuardados.cuotas;
      mostrarResultados(
        datosGuardados.arrayCuotas,
        datosGuardados.devolucionTotal
      );
    }
  } catch (error) {
    mostrarMensajeError("Hubo un problema al cargar los datos guardados.");
    console.error(error);
  }
}


function calcularPrestamo() {
  try {
    const monto = Number(montoInput.value);
    const cuotas = Number(cuotasInput.value);

    if (cuotas > 12) {
      resultadoDiv.innerHTML = "<p>¡Superó el máximo de cuotas permitido!</p>";
      cambiarEstiloInput(cuotasInput, false);
      throw new Error("Superó el máximo de cuotas permitido");
    }

    cambiarEstiloInput(cuotasInput, true);

    // Calcular los datos
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
    guardarDatosEnStorage(monto, cuotas, arrayCuotas, devolucionTotal);
    agregarAlHistorial(monto, cuotas, precioCuota, devolucionTotal);

    // Actualizar el gráfico con los datos calculados
    actualizarGrafico(monto, cuotas);

    // Notificación de éxito
    Toastify({
      text: "Préstamo calculado correctamente",
      duration: 3000,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  } catch (error) {
    // En caso de error, mostrar un mensaje de UX amigable
    mostrarMensajeError("Ocurrió un error al calcular el préstamo. Intenta nuevamente.");
    console.error(error); // Mostrar el error técnico en la consola
  }
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

// Inicializar el gráfico (sin datos)
const ctx = document.getElementById("grafico-cuotas").getContext("2d");
const grafico = new Chart(ctx, {
  type: "line", // Tipo de gráfico
  data: {
    labels: [], // Etiquetas del eje X (por ejemplo, cantidad de cuotas)
    datasets: [
      {
        label: "Cuota del préstamo",
        data: [], // Datos del gráfico (cuotas calculadas)
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  },
});

// Función para actualizar el gráfico con los datos calculados
function actualizarGrafico(monto, cuotas) {
  // Calcular las cuotas utilizando la función que ya tienes
  let tasaInteres = calculoInteres(cuotas); // Obtener la tasa de interés para las cuotas
  let cuotasCalculadas = [];
  for (let i = 1; i <= cuotas; i++) {
    const cuota = calculoCuotas(monto, tasaInteres, i); // Calcular el monto de cada cuota
    cuotasCalculadas.push(cuota.toFixed(2)); // Guardar las cuotas calculadas (con 2 decimales)
  }

  // Actualizar etiquetas del gráfico con la cantidad de cuotas
  grafico.data.labels = Array.from(
    { length: cuotas },
    (_, i) => `Cuota ${i + 1}`
  );

  // Actualizar los datos del gráfico con los valores de las cuotas
  grafico.data.datasets[0].data = cuotasCalculadas;

  // Actualizar el gráfico para reflejar los cambios
  grafico.update();
}

// ----- CAMBIO DE TEMA OSCURO/CLARO ------
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Cambiar tema y actualizar íconos
function toggleTheme() {
  const isDarkMode = themeToggle.checked;
  document.body.classList.toggle("dark-theme", isDarkMode);
  
  // Actualizar el ícono según el tema
  if (isDarkMode) {
    themeIcon.classList.replace("fa-sun", "fa-moon");
  } else {
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }

  // Guardar preferencia en localStorage
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

// Verificar preferencia de tema al cargar la página
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  themeToggle.checked = true;
  document.body.classList.add("dark-theme");
  themeIcon.classList.add("fa-moon");
} else {
  themeToggle.checked = false;
  document.body.classList.remove("dark-theme");
  themeIcon.classList.add("fa-sun");
}

themeToggle.addEventListener("change", toggleTheme);

