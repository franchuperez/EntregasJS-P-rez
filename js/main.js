/* contenedores */
const contenedorCursos = document.getElementById("cursos");

/* ruta al JSON */
const URL_LOCAL = "./data/cursos.json";

/* mostrar cursos */
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

/* agregar al carrito */
if (contenedorCursos) {
  contenedorCursos.addEventListener("click", (e) => {
    if (e.target.classList.contains("agregar")) {
      const id = parseInt(e.target.dataset.id, 10);

      fetch(URL_LOCAL)
        .then((response) => response.json())
        .then((cursos) => {
          const cursoItem = cursos.find((curso) => curso.id === id);
          if (cursoItem) {
            sumaralcarrito(cursoItem); 
            Swal.fire({ 
              icon: "success", 
              title: `${cursoItem.nombre} agregado al carrito`, 
              toast: true, 
              position: "top-end", 
              showConfirmButton: false, 
              timer: 1600 
            });
          }
        })
        .catch((error) => console.error("Error al agregar:", error));
    }
  });
}

/* filtros */
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

  [inputNombre, inputMin, inputMax].forEach((elemento) => elemento.addEventListener("input", aplicar));
}

/* cargar cursos */
function cargarCursos() {
  fetch(URL_LOCAL)
    .then((response) => response.json())
    .then((cursos) => {
      mostrarCursos(cursos);
      aplicarFiltros(cursos);
    })
    .catch((error) => console.error("No se pudo cargar el JSON:", error));
}

cargarCursos();