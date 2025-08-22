
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function guardarCarrito() {
localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
carrito = [];
guardarCarrito();
}

function agregarAlCarrito(item) {
const existente = carrito.find((it) => it.id === item.id);
if (existente) {
    existente.cantidad = (existente.cantidad || 1) + 1;
} else {
    carrito.push({ ...item, cantidad: 1 });
}
guardarCarrito();
}

function aumentarCantidad(id) {
const it = carrito.find((i) => i.id === id);
if (it) { it.cantidad += 1; guardarCarrito(); }
}
function disminuirCantidad(id) {
const it = carrito.find((i) => i.id === id);
if (it) {
    it.cantidad -= 1;
    if (it.cantidad <= 0) {
    carrito = carrito.filter((i) => i.id !== id);
    }
    guardarCarrito();
}
}
function eliminarDelCarrito(id) {
carrito = carrito.filter((i) => i.id !== id);
guardarCarrito();
}
function calcularTotal() {
    return carrito.reduce((acc, i) => acc + i.precio * (i.cantidad || 1), 0);
}
