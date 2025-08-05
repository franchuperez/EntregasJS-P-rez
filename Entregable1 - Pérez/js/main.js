// Precios de los Service
const preciosService = {
  basico: 15000,
  completo: 25000,
  premium: 40000
};

// nombre, apellido y kms
function solicitarDatos() {
    let nombre = prompt("Ingrese su nombre:");
      let modelo = prompt("Ingrese el modelo de su auto:");
        let km = parseInt(prompt("Ingrese el kilometraje actual del auto:"));
          return { nombre, modelo, km };
}

// elegir tipo de service
function elegirService() {
    let tipo = prompt(
      "Seleccione el tipo de service:\n- basico\n- completo\n- premium"
  ).toLowerCase();
  while (!preciosService[tipo]) {
      tipo = prompt("Opción inválida. Escriba: basico, completo o premium").toLowerCase();
    }
  return tipo;
}

// calcular el presupuesto
function calcularPresupuesto(datos, tipoService) {
  let precio = preciosService[tipoService];
  let mensaje = `Hola ${datos.nombre},\n\nEl service ${tipoService.toUpperCase()} para tu ${datos.modelo} con ${datos.km} km cuesta: $${precio}.\n\nGracias por usar nuestro simulador.`;
  
  alert(mensaje);
  console.log(mensaje);
}

// inicio
function iniciarSimulador() {
  let confirmar = confirm("¿Deseás iniciar el simulador de service?");
  if (confirmar) {
    const datosUsuario = solicitarDatos();
    const tipoService = elegirService();
    calcularPresupuesto(datosUsuario, tipoService);
  } else {
    alert("Gracias por visitar nuestro simulador. ¡Hasta pronto!");
  }
}

// Iniciar
iniciarSimulador();
