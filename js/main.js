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

/* filtro de rango de precios para los cursos */
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
