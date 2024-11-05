// Se le solicita el usuario el ingreso de los datos para el prestamo:
let monto = Number(prompt("Ingrese el monto a solicitar:"));
let cuotas = Number(prompt("Ingrese la cantidad de cuotas en que quiera pagarlo, como máximo 12"));

let tasaInteres = calculoInteres(cuotas);
let precioCuota = calculoCuotas(monto, tasaInteres, cuotas);
let devolucionTotal = devolucion(precioCuota, cuotas);

// Creo un array para almacenar el detalle de cada cuota:
let arrayCuotas = [];

if (cuotas <= 12) {
  // Use un for para guardar en el array las cuotas
  for (let i = 1; i <= cuotas; i++) {
    // Guardo cada cuota como un objeto en el array:
    arrayCuotas.push({
      numeroCuota: i,
      monto: precioCuota.toFixed(2)
    });
  }

  // Armo el mensaje a partir del array de cuotas:
  let mensaje = '';
  arrayCuotas.forEach(cuota => {
    mensaje += `Cuota número: ${cuota.numeroCuota} - Monto de cuota: $${cuota.monto}\n`;
  });

  // Añado el total a devolver al final del mensaje
  mensaje += `\nTotal a devolver: $${devolucionTotal.toFixed(2)}`;
  
  // Muestro el mensaje en un alert
  alert(mensaje);
  
} else {
  alert("¡Superó el máximo de cuotas permitido!");
}

// Función para calcular la tasa de interés:
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

// Función para calcular el monto de cada cuota
function calculoCuotas(monto, tasaInteres, cuotas) {
  let interes = monto * tasaInteres; 
  let precioCuota = (monto + interes) / cuotas;
  return precioCuota;
}

// Función para calcular el total a devolver
function devolucion(precioCuota, cuotas) {    
  let total = precioCuota * cuotas;
  return total;
}
