let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
carrito = [];
guardarCarrito();
}
