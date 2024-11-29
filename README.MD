# Calculadora de Préstamos

## Descripción

Este proyecto es una **Calculadora de Préstamos** que permite a los usuarios calcular las cuotas mensuales de un préstamo, teniendo en cuenta la cantidad de cuotas y el monto solicitado. Además, ofrece la posibilidad de guardar los datos en el historial y cargarlos desde el almacenamiento local en futuras sesiones.

## Funcionalidades

- **Cálculo de préstamo**: El usuario ingresa el monto del préstamo y la cantidad de cuotas. La aplicación calcula automáticamente la tasa de interés, el monto de cada cuota y el total a devolver.
- **Historial de cálculos**: Cada vez que se realiza un cálculo, el resultado se guarda en el historial. El historial es accesible en todo momento y se muestra en la interfaz.
- **Almacenamiento local**: Los datos del préstamo y el historial se guardan en el `localStorage` del navegador, lo que permite que los datos persistan entre sesiones.
- **Validación de datos**: Se validan el monto y la cantidad de cuotas, asegurando que los valores ingresados sean válidos antes de realizar el cálculo.

## Instrucciones de Uso

1. **Cargar el proyecto**: Descarga o clona este repositorio en tu máquina local.
   
2. **Abrir en el navegador**: Abre el archivo `index.html` en cualquier navegador web moderno.

3. **Realizar un cálculo de préstamo**:
   - Ingresa el **monto** del préstamo en el campo correspondiente.
   - Ingresa la **cantidad de cuotas** (máximo 12 cuotas).
   - Haz clic en el botón "Calcular préstamo".

4. **Ver los resultados**:
   - El monto de cada cuota y el total a devolver se mostrarán en la parte inferior de la página.
   - Los cálculos realizados se almacenarán en el historial, accesible más abajo.

5. **Historial**:
   - Los cálculos realizados se guardan en el historial y se muestran automáticamente.
   - Puedes borrar el historial utilizando el botón "Borrar historial".

6. **Reiniciar la aplicación**: Puedes recargar la página para iniciar un nuevo cálculo, y los datos del último préstamo realizado serán cargados automáticamente si existían en el almacenamiento local.

## Tecnologías Usadas

- **HTML5**: Para la estructura de la página web.
- **CSS3**: Para el diseño y la presentación de la interfaz.
- **JavaScript**: Para la lógica de la aplicación, incluyendo el cálculo de cuotas, almacenamiento en `localStorage` y manejo de eventos.
- **Chart.js**: Para mostrar un gráfico con los montos de las cuotas a pagar en función de la cantidad de cuotas.
- **Bootstrap**: Para el diseño responsivo y los estilos de los elementos de la interfaz, como botones y formularios.
- **Toastify**: Para mostrar notificaciones de éxito y error de manera visual y amigable para el usuario.

## Archivos del Proyecto

- `index.html`: Contiene la estructura principal de la página.
- `styles.css`: Estilos para la interfaz.
- `index.js`: Lógica de la aplicación, incluyendo el cálculo de préstamos y el manejo del almacenamiento local.
- `prestamo.js`: Funciones para calcular el interés, las cuotas y el total a devolver.

