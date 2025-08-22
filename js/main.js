/* contenedores */
const contenedorCursos = document.getElementById("cursos");
const contenedorCarrito = document.getElementById("carrito");

/* ruta */
const URL_LOCAL = "data/cursos.json";

function mostrarCursos(listaCursos) {
  if (!contenedorCursos) return;
  contenedorCursos.innerHTML = `
    ${listaCursos.map((curso) => `
      <div>
        <h3>${curso.nombre}</h3>
        <p>Precio: $${curso.precio}</p>
        <button class="agregar" data-id="${curso.id}">Agregar al carrito</button>
      </div>
    `).join("")}
  `;
}

if (!Array.isArray(carrito)) carrito = [];

function mostrarCarrito() {
  if (!contenedorCarrito) return;
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "El carrito está vacío";
    return;
  }

  contenedorCarrito.innerHTML = `
    ${carrito.map((item) => `
      <div>
        ${item.nombre} - $${item.precio} x ${item.cantidad || 1}
        <span>
          <button class="menos" data-id="${item.id}">-</button>
          <button class="mas" data-id="${item.id}">+</button>
          <button class="eliminar" data-id="${item.id}">Eliminar</button>
        </span>
      </div>
    `).join("")}
    <div><strong>Total: $${calcularTotal()}</strong></div>
    <button id="finalizar">Finalizar compra</button>
    <button id="vaciar">Vaciar Carrito</button>
  `;
}

if (contenedorCarrito) {
  contenedorCarrito.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id, 10);
    if (e.target.classList.contains("mas")) {
      aumentarCantidad(id);
      mostrarCarrito();
    } else if (e.target.classList.contains("menos")) {
      disminuirCantidad(id);
      mostrarCarrito();
    } else if (e.target.classList.contains("eliminar")) {
      eliminarDelCarrito(id);
      mostrarCarrito();
      Swal.fire({ 
        icon: "warning", 
        title: "Curso eliminado", 
        toast: true, 
        position: "top-end", 
        showConfirmButton: false, 
        timer: 1600 
      });
    } else if (e.target.id === "finalizar") {
      window.location.href = "pages/formulario.html";
    } else if (e.target.id === "vaciar") {
      vaciarCarrito();
      mostrarCarrito();
      Swal.fire({ 
        icon: "error", 
        title: "Carrito vaciado", 
        toast: true, 
        position: "top-end", 
        showConfirmButton: false, 
        timer: 1600 
      });
    }
  });
}

/* agregar al carrito */
if (contenedorCursos) {
  contenedorCursos.addEventListener("click", (e) => {
    if (e.target.classList.contains("agregar")) {
      const id = parseInt(e.target.dataset.id, 10);
      
      fetch(URL_LOCAL)
        .then((r) => r.json())
        .then((cursos) => {
          const cursoItem = cursos.find((curso) => curso.id === id);
          if (cursoItem) {
            agregarAlCarrito(cursoItem);
            mostrarCarrito();
            Swal.fire({ 
              icon: "success", 
              title: `${cursoItem.nombre} agregado`, 
              toast: true, 
              position: "top-end", 
              showConfirmButton: false, 
              timer: 1600 
            });
          }
        })
        .catch((err) => console.error("Error al agregar:", err));
    }
  });
}

function aplicarFiltros(listaCursos) {
  const filtrosHtml = `
    <div class="filtros-container">
      <div class="filtro-group">
        <label>Buscar por nombre:</label>
        <input id="filtroNombre" class="filtro-input" placeholder="Ej: React">
      </div>
      <div class="filtro-group">
        <label>Precio mínimo:</label>
        <input id="filtroMin" type="number" class="filtro-input" placeholder="Ej: 5000">
      </div>
      <div class="filtro-group">
        <label>Precio máximo:</label>
        <input id="filtroMax" type="number" class="filtro-input" placeholder="Ej: 15000">
      </div>
    </div>
  `;
  contenedorCursos.insertAdjacentHTML("beforebegin", filtrosHtml);

  const inputNombre = document.getElementById("filtroNombre");
  const inputMin = document.getElementById("filtroMin");
  const inputMax = document.getElementById("filtroMax");

  const aplicar = () => {
    const nombre = (inputNombre.value || "").toLowerCase();
    const min = parseFloat(inputMin.value) || 0;
    const max = parseFloat(inputMax.value) || Infinity;

    const filtrados = listaCursos.filter((curso) =>
      curso.nombre.toLowerCase().includes(nombre) &&
      curso.precio >= min &&
      curso.precio <= max
    );
    mostrarCursos(filtrados);
  };

  [inputNombre, inputMin, inputMax].forEach((el) => el.addEventListener("input", aplicar));
}

/* cargar los cursos */
function cargarCursos() {
  fetch(URL_LOCAL)
    .then((r) => r.json())
    .then((cursos) => {
      mostrarCursos(cursos);
      aplicarFiltros(cursos);
    })
    .catch((err) => console.error("No se pudo cargar el JSON:", err));
}

cargarCursos();
mostrarCarrito();