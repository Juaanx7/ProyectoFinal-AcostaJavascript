// Función para calcular el interés según la cantidad de cuotas
export function calculoInteres(cuotas) {
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
export function calculoCuotas(monto, tasaInteres, cuotas) {
    const interes = monto * tasaInteres;
    return (monto + interes) / cuotas;
}

// Función para calcular el total a devolver
export function devolucion(precioCuota, cuotas) {
    return precioCuota * cuotas;
}