const contenedorCursos = document.getElementById("cursos");
const contenedorCarrito = document.getElementById("carrito");
const btnVaciar = document.getElementById("vaciar");
const URL_LOCAL = "data/cursos.json";

/* Guardar carrito en localStorage */
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* Vaciar carrito */
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

/* Mostrar carrito en pantalla */
function mostrarCarrito() {
  if (!contenedorCarrito) return;

  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerText = "El carrito está vacío";
    return;
  }

  carrito.forEach((curso, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${curso.nombre} - $${curso.precio}
      <button data-index="${index}" class="eliminar">Eliminar</button>
    `;
    contenedorCarrito.appendChild(div);
  });

  document.querySelectorAll(".eliminar").forEach(btn =>
    btn.addEventListener("click", e => {
      const i = parseInt(e.target.dataset.index);
      carrito.splice(i, 1);
      guardarCarrito();
      mostrarCarrito();
      Toastify({
        text: "Curso eliminado del carrito",
        duration: 2000,
        style: { background: "orange" }
      }).showToast();
    })
  );

  const total = carrito.reduce((sum, curso) => sum + curso.precio, 0);
  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
  contenedorCarrito.appendChild(totalDiv);

const finalizarBtn = document.createElement("button");
finalizarBtn.textContent = "Finalizar compra";
finalizarBtn.addEventListener("click", () => {
  window.location.href = "pages/formulario.html";
});
contenedorCarrito.appendChild(finalizarBtn);

}

/* Mostrar formulario de compra */
function mostrarFormularioCompra() {
  contenedorCarrito.innerHTML = `
    <h3>Finalizar compra</h3>
    <form id="formCompra">
      <input type="text" id="nombre" placeholder="Tu nombre" required /><br>
      <input type="email" id="email" placeholder="Tu correo" required /><br>
      <input type="text" id="direccion" placeholder="Dirección de entrega" required /><br>
      <button type="submit">Confirmar compra</button>
    </form>
  `;

  document.getElementById("formCompra").addEventListener("submit", e => {
    e.preventDefault();

    localStorage.removeItem("carrito");
    carrito = [];

    window.location.href = "gracias.html";
  });
}

/* Mostrar cursos en pantalla y agregar eventos */
function mostrarCursos(cursos) {
  if (!contenedorCursos) return;

  contenedorCursos.innerHTML = "";

  cursos.forEach(curso => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${curso.nombre}</h3>
      <p>Precio: $${curso.precio}</p>
      <button class="agregar" data-id="${curso.id}">Agregar al carrito</button>
    `;
    contenedorCursos.appendChild(div);
  });

  // Agregar evento a botones "Agregar"
  document.querySelectorAll(".agregar").forEach(btn =>
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      agregarCurso(id);
    })
  );
}

/* Agregar curso al carrito buscando en JSON local */
async function agregarCurso(id) {
  try {
    const res = await fetch(URL_LOCAL);
    if (!res.ok) throw new Error("Error al cargar cursos");
    const cursos = await res.json();
    const curso = cursos.find(c => c.id === id);

    if (curso) {
      carrito.push(curso);
      guardarCarrito();
      mostrarCarrito();

      Toastify({
        text: `${curso.nombre} agregado al carrito`,
        duration: 3000,
        style: { background: "green" }
      }).showToast();
    }
  } catch (error) {
    console.error("Error en agregarCurso:", error);
  }
}

/* Filtro de búsqueda por nombre */
function aplicarFiltro(cursos) {
  const input = document.createElement("input");
  input.placeholder = "Buscar curso...";
  input.addEventListener("input", () => {
    const filtro = cursos.filter(c =>
      c.nombre.toLowerCase().includes(input.value.toLowerCase())
    );
    mostrarCursos(filtro);
  });
  contenedorCursos.before(input);
}

/* Filtro por precio mínimo y máximo */
function aplicarFiltroPorPrecio(cursos) {
  const container = document.createElement("div");
  const inputMin = document.createElement("input");
  const inputMax = document.createElement("input");

  inputMin.placeholder = "Precio mínimo";
  inputMin.type = "number";

  inputMax.placeholder = "Precio máximo";
  inputMax.type = "number";

  [inputMin, inputMax].forEach(input =>
    input.addEventListener("input", () => {
      const min = parseFloat(inputMin.value) || 0;
      const max = parseFloat(inputMax.value) || Infinity;
      const filtrado = cursos.filter(c => c.precio >= min && c.precio <= max);
      mostrarCursos(filtrado);
    })
  );

  container.append("Filtrar por precio: ", inputMin, inputMax);
  contenedorCursos.before(container);
}

/* Cargar cursos desde JSON local */
async function cargarCursos() {
  try {
    const res = await fetch(URL_LOCAL);
    if (!res.ok) throw new Error("No se pudo cargar el archivo JSON");
    const cursos = await res.json();

    mostrarCursos(cursos);
    aplicarFiltro(cursos);
    aplicarFiltroPorPrecio(cursos);
  } catch (error) {
    console.error("Error al cargar cursos:", error);
  } finally {
    console.log("Proceso de carga finalizado");
  }
}

/* Evento para vaciar carrito */
btnVaciar.addEventListener("click", () => {
  vaciarCarrito();
  mostrarCarrito();

  Toastify({
    text: "Carrito vaciado",
    duration: 2000,
    style: { background: "red" }
  }).showToast();
});

/* Iniciar app */
document.addEventListener("DOMContentLoaded", () => {
  cargarCursos();
  mostrarCarrito();
});
