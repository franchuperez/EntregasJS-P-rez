// Arrays para tipos y precios
const tiposService = ["basico", "completo", "premium"];
const preciosService = [15000, 25000, 40000];

// Intervalo fijo para calcular services
const INTERVALO_SERVICE = 10000;

// Capturar elementos del DOM
const form = document.getElementById("formService");
const resultadoDiv = document.getElementById("resultado");
const historialDiv = document.getElementById("historial");
const verHistorialBtn = document.getElementById("verHistorial");
const vaciarHistorialBtn = document.getElementById("vaciarHistorial");

// Evento: enviar formulario
form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Capturar datos
    const nombre = document.getElementById("nombre").value;
    const modelo = document.getElementById("modelo").value;
    const km = parseInt(document.getElementById("km").value);
    const tipoService = document.getElementById("tipoService").value;

    // Validar km positivos
    if (isNaN(km) || km <= 0) {
        alert("Ingrese un número válido y positivo para los kilómetros.");
        return;
    }

    // Calcular precio
    let index = tiposService.indexOf(tipoService);
    let precio = preciosService[index];

    // Calcular cantidad de services realizados
    let cantidadServices = calcularCantidadServices(km);

    // Crear objeto usuario
    const datosUsuario = {
        id: Date.now(),
        nombre,
        modelo,
        km,
        tipoService,
        precio,
        cantidadServices
    };

    // Guardar en localstorage
    guardarEnLocalStorage(datosUsuario);

    // Mostrar resultado
    mostrarResultado(datosUsuario);

    // Reset formulario
    form.reset();
});

// Guardar presupuesto en localstorage
function guardarEnLocalStorage(data) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push(data);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Mostrar resultado
function mostrarResultado(datos) {
    resultadoDiv.innerHTML = `
        <h2>Presupuesto Generado</h2>
        <p class="label">Nombre:</p> <p>${datos.nombre}</p>
        <p class="label">Modelo:</p> <p>${datos.modelo}</p>
        <p class="label">Kilometraje:</p> <p>${datos.km} km</p>
        <p class="label">Tipo de Service:</p> <p>${datos.tipoService.toUpperCase()}</p>
        <p class="label">Costo Total:</p> <p>$${datos.precio}</p>
        <p class="label">Services realizados estimados:</p> <p>${datos.cantidadServices} (cada ${INTERVALO_SERVICE} km)</p>
    `;
    resultadoDiv.style.display = "block";
}

// Calcular cantidad de services en base a kilómetros e intervalo fijo
function calcularCantidadServices(kilometros) {
    return Math.floor(kilometros / INTERVALO_SERVICE);
}

// Evento: ver historial
verHistorialBtn.addEventListener("click", mostrarHistorial);

// Mostrar historial con foreach
function mostrarHistorial() {
    historialDiv.innerHTML = "<h2>Historial de Presupuestos</h2>";
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.length === 0) {
        historialDiv.innerHTML += "<p>No hay presupuestos guardados.</p>";
    } else {
        usuarios.forEach(datos => {
            let div = document.createElement("div");
            div.className = "presupuesto";
            div.innerHTML = `
                <p class="label">Nombre:</p> <p>${datos.nombre}</p>
                <p class="label">Modelo:</p> <p>${datos.modelo} (${datos.km} km)</p>
                <p class="label">Service:</p> <p>${datos.tipoService.toUpperCase()}</p>
                <p class="label">Costo:</p> <p>$${datos.precio}</p>
                <p class="label">Services estimados:</p> <p>${datos.cantidadServices} (cada ${INTERVALO_SERVICE} km)</p>
                <button onclick="eliminarPresupuesto(${datos.id})">Eliminar</button>
            `;
            historialDiv.appendChild(div);
        });
    }
    historialDiv.style.display = "block";
}

// Eliminar presupuesto
function eliminarPresupuesto(id) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.filter(datos => datos.id !== id);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarHistorial();
}

// Evento: vaciar historial
vaciarHistorialBtn.addEventListener("click", function() {
    localStorage.removeItem("usuarios");
    historialDiv.innerHTML = "<p>Historial eliminado correctamente.</p>";
});
