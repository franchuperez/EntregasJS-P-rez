let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contenedorCarrito = document.getElementById("carrito");

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* agregar el primer curso al carrito */
function sumaralcarrito(item) {
  const cursoEncontrado = carrito.find((curso) => curso.id === item.id);
  if (cursoEncontrado) {
    cursoEncontrado.cantidad = (cursoEncontrado.cantidad || 1) + 1;
  } else {
    carrito.push({ ...item, cantidad: 1 });
  }
  guardarCarrito();
}

function calcularTotal() {
  return carrito.reduce((sumaTotal, curso) => sumaTotal + curso.precio * (curso.cantidad || 1), 0);
}

function mostrarCarrito() {
  if (!contenedorCarrito) return;

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  contenedorCarrito.innerHTML = `
    ${carrito.map(curso => `
      <div>
        ${curso.nombre} - $${curso.precio} x ${curso.cantidad || 1}
        <span>
          <button class="menos" data-id="${curso.id}">-</button>
          <button class="mas" data-id="${curso.id}">+</button>
          <button class="eliminar" data-id="${curso.id}">Eliminar</button>
        </span>
      </div>
    `).join("")}
    <div><strong>Total: $${calcularTotal()}</strong></div>
    <button id="finalizar">Finalizar compra</button>
    <button id="vaciar">Vaciar carrito</button>
  `;
}

/* para sumar mas cursos al carrito + */
function sumar(id) {
  const curso = carrito.find(curso => curso.id === id);
  if (curso) curso.cantidad += 1;
  guardarCarrito();
}

/* para restar cursos del carrito - */
function restar(id) {
  const curso = carrito.find(curso => curso.id === id);
  if (curso) {
    curso.cantidad -= 1;
    if (curso.cantidad <= 0) {
      carrito = carrito.filter(curso => curso.id !== id);
    }
  }
  guardarCarrito();
}

/* para eliminar algun producto del carrito */
function eliminar(id) {
  carrito = carrito.filter(curso => curso.id !== id);
  guardarCarrito();
}

/* vaciar el carrito */
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

if (contenedorCarrito) {
  contenedorCarrito.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id, 10);

    if (e.target.classList.contains("mas")) {
      sumar(id);
      mostrarCarrito();
    } else if (e.target.classList.contains("menos")) {
      restar(id);
      mostrarCarrito();
    } else if (e.target.classList.contains("eliminar")) {
      eliminar(id);
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
      window.location.href = "formulario.html";
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

mostrarCarrito();