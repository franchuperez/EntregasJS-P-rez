// Arrays para tipos y precios
const tiposService = ["basico", "completo", "premium"];
const preciosService = [15000, 25000, 40000];

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

    // Crear objeto usuario
    const datosUsuario = {
        id: Date.now(), // ID único
        nombre,
        modelo,
        km,
        tipoService,
        precio
    };

    // Guardar en LocalStorage
    guardarEnLocalStorage(datosUsuario);

    // Mostrar resultado
    mostrarResultado(datosUsuario);

    // Reset formulario
    form.reset();
});

// Guardar presupuesto en LocalStorage
function guardarEnLocalStorage(data) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push(data);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Mostrar resultado
function mostrarResultado(datos) {
    resultadoDiv.innerHTML = `
        <h2>Presupuesto Generado</h2>
        <p><strong>Nombre:</strong> ${datos.nombre}</p>
        <p><strong>Modelo:</strong> ${datos.modelo}</p>
        <p><strong>Kilometraje:</strong> ${datos.km} km</p>
        <p><strong>Tipo de Service:</strong> ${datos.tipoService.toUpperCase()}</p>
        <p><strong>Costo Total:</strong> $${datos.precio}</p>
    `;
    resultadoDiv.style.display = "block";
}

// Evento: ver historial
verHistorialBtn.addEventListener("click", mostrarHistorial);

// Mostrar historial con forEach (función de orden superior)
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
                <p><strong>${datos.nombre}</strong> - ${datos.modelo} (${datos.km} km)</p>
                <p>Service: ${datos.tipoService.toUpperCase()}</p>
                <p>Costo: $${datos.precio}</p>
                <button onclick="eliminarPresupuesto(${datos.id})">Eliminar</button>
            `;
            historialDiv.appendChild(div);
        });
    }
    historialDiv.style.display = "block";
}

// Eliminar presupuesto (usando filter, función de orden superior)
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
