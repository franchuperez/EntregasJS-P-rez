/* contenedor que muestra los cursos disponibles */
const contenedorCursos = document.getElementById("cursos");

/* contenedor que muestra el carrito */
const contenedorCarrito = document.getElementById("carrito");

/* boton para vaciar el carrito */
const btnVaciar = document.getElementById("vaciar");

/* ruta al archivo JSON */
const URL_LOCAL = "js/cursos.json";

/*vaciar el carrito  guardar el cambio el localStorage */
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

/* contenido del carrito */
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

/* para que ande el botón "Eliminar" para quitar cursos del carrito */
  document.querySelectorAll(".eliminar").forEach(btn =>
    btn.addEventListener("click", e => {
      const i = parseInt(e.target.dataset.index);
      carrito.splice(i, 1);
      guardarCarrito();
      mostrarCarrito();
      Swal.fire({
        icon: "warning",
        title: "Curso eliminado del carrito",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000
      });
    })
  );  

/* total del carrito */
  const total = carrito.reduce((sum, curso) => sum + curso.precio, 0);
  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
  contenedorCarrito.appendChild(totalDiv);

/* boton para finalizar la compra */
  const finalizarBtn = document.createElement("button");
  finalizarBtn.textContent = "Finalizar compra";
  finalizarBtn.addEventListener("click", () => {
    window.location.href = "pages/formulario.html";
  });
  contenedorCarrito.appendChild(finalizarBtn);
}

/* mostrar los cursos disponibles en la página */
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

/* funcionalidad para agregar cursos al carrito */
  document.querySelectorAll(".agregar").forEach(btn =>
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      agregarCurso(id);
    })
  );
}

/* agregar el curso al carrito */
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
      Swal.fire({
        icon: "success",
        title: `${curso.nombre} agregado al carrito`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000
      });
    }
  } catch (error) {
    console.error("Error en agregarCurso:", error);
  }
}

/* filtrar noombre de los cursos */
/* NUEVO: filtros combinados por nombre y precio con diseño mejorado */
function aplicarFiltros(cursos) {
  const filtrosContainer = document.createElement("div");
  filtrosContainer.className = "filtros-container";

  // Buscar por nombre
  const grupoNombre = document.createElement("div");
  grupoNombre.className = "filtro-group";
  const labelNombre = document.createElement("label");
  labelNombre.textContent = "Buscar por nombre:";
  const inputNombre = document.createElement("input");
  inputNombre.placeholder = "Ej: React";
  inputNombre.className = "filtro-input";
  grupoNombre.append(labelNombre, inputNombre);

  // Precio mínimo
  const grupoMin = document.createElement("div");
  grupoMin.className = "filtro-group";
  const labelMin = document.createElement("label");
  labelMin.textContent = "Precio mínimo:";
  const inputMin = document.createElement("input");
  inputMin.placeholder = "Ej: 5000";
  inputMin.type = "number";
  inputMin.className = "filtro-input";
  grupoMin.append(labelMin, inputMin);

  // Precio máximo
  const grupoMax = document.createElement("div");
  grupoMax.className = "filtro-group";
  const labelMax = document.createElement("label");
  labelMax.textContent = "Precio máximo:";
  const inputMax = document.createElement("input");
  inputMax.placeholder = "Ej: 15000";
  inputMax.type = "number";
  inputMax.className = "filtro-input";
  grupoMax.append(labelMax, inputMax);

  const aplicar = () => {
    const nombre = inputNombre.value.toLowerCase();
    const min = parseFloat(inputMin.value) || 0;
    const max = parseFloat(inputMax.value) || Infinity;

    const resultado = cursos.filter(c =>
      c.nombre.toLowerCase().includes(nombre) &&
      c.precio >= min &&
      c.precio <= max
    );

    mostrarCursos(resultado);
  };

  [inputNombre, inputMin, inputMax].forEach(input =>
    input.addEventListener("input", aplicar)
  );

  filtrosContainer.append(grupoNombre, grupoMin, grupoMax);
  contenedorCursos.before(filtrosContainer);
}



async function cargarCursos() {
  try {
    const res = await fetch(URL_LOCAL);
    if (!res.ok) throw new Error("No se pudo cargar el archivo JSON");
    const cursos = await res.json();

    mostrarCursos(cursos);           
    aplicarFiltros(cursos);           
  } catch (error) {
    console.error("Error al cargar cursos:", error);
  }
}

/* vaciar carrito */
btnVaciar.addEventListener("click", () => {
  vaciarCarrito();   
  mostrarCarrito();  
  Swal.fire({
    icon: "error",
    title: "Carrito vaciado",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000
  });
});


document.addEventListener("DOMContentLoaded", () => {
  cargarCursos();     
  mostrarCarrito();   
});
