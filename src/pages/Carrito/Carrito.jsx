import React from "react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import { useCarrito } from "../../context/CarritoContext"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Swal from "sweetalert2"
import PedidoService from "../../services/PedidoService"
import "./Carrito.css"

function Carrito() {
    const { carrito, eliminarDelCarrito, actualizarCantidad, precioTotal, vaciarCarrito } = useCarrito()

    const finalizarCompra = async () => {
        const usuario = JSON.parse(localStorage.getItem("usuarioSesion"))

        if (!usuario) {
            Swal.fire({
                icon: "warning",
                title: "Sesión Requerida",
                text: "Debes iniciar sesión para finalizar tu compra.",
                confirmButtonColor: "#2E4630",
                confirmButtonText: "Iniciar Sesión"
            }).then((res) => { if (res.isConfirmed) window.location.href = "/login" })
            return
        }

        const confirmacion = await Swal.fire({
            title: "¿Confirmar compra?",
            html:
                "<div style=\"text-align:center;\">" +
                "<p style=\"color:#4a5568; font-size: 16px; margin-bottom: 15px;\">Estás a punto de finalizar tu pedido por un total de</p>" +
                "<p style=\"font-size: 36px; font-weight: 900; color: #2E4630; margin: 0;\">₡" + precioTotal.toLocaleString() + "</p>" +
                "<p style=\"color:#718096; font-size: 14px; margin-top: 10px;\">" + carrito.length + " artículo(s) en tu pedido</p>" +
                "</div>",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2E4630",
            cancelButtonColor: "#718096",
            confirmButtonText: "✅ Confirmar Compra",
            cancelButtonText: "Cancelar"
        })

        if (!confirmacion.isConfirmed) return

        // Guardar pedido en db.json
        const nuevoPedido = {
            id: "pedido_" + Date.now(),
            usuarioId: usuario.id,
            usuarioNombre: usuario.nombre,
            usuarioCorreo: usuario.correo,
            items: carrito.map(item => ({
                id: item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                subtotal: item.precio * item.cantidad
            })),
            total: precioTotal,
            fecha: new Date().toISOString(),
            estado: "nuevo",
            visto: false
        }

        await PedidoService.PostPedidos(nuevoPedido)
        vaciarCarrito()

        Swal.fire({
            title: "¡Compra Realizada! 🌿",
            html:
                "<div style=\"text-align:center; padding: 10px;\">" +
                "<div style=\"font-size: 64px; margin-bottom: 15px;\">🎉</div>" +
                "<p style=\"font-size: 18px; color: #2E4630; font-weight: 700; margin-bottom: 10px;\">¡Gracias por tu pedido, " + usuario.nombre + "!</p>" +
                "<p style=\"color:#4a5568; font-size: 15px;\">Tu orden ha sido recibida y está siendo procesada. Nos pondremos en contacto contigo pronto.</p>" +
                "<p style=\"margin-top: 15px; font-size: 28px; font-weight: 900; color: #2E4630;\">Total: ₡" + precioTotal.toLocaleString() + "</p>" +
                "</div>",
            confirmButtonColor: "#2E4630",
            confirmButtonText: "¡Perfecto!",
            showClass: { popup: "animate__animated animate__bounceIn" }
        })
    }

    return (
        <div id="paginaCarrito">
            <Header />
            <main className="contenedor espaciadoSuperior">
                <h1 className="tituloSeccion">Tu Carrito</h1>

                {carrito.length === 0 ? (
                    <div className="carritoVacio efectoVidrioUltra">
                        <p>Aún no has añadido elementos a tu santuario.</p>
                        <button className="botonPrimario" onClick={() => window.location.href = "/"}>Ir a la tienda</button>
                    </div>
                ) : (
                    <div className="layoutCarrito">
                        <div className="listaElementos">
                            {carrito.map(item => (
                                <div key={item.id} className="tarjetaCarrito efectoVidrioUltra">
                                    <img src={item.imagen} alt={item.nombre} className="imagenMiniatura" />
                                    <div className="infoElemento">
                                        <h3>{item.nombre}</h3>
                                        <p className="precioUnitario">{"₡" + item.precio.toLocaleString()}</p>
                                    </div>
                                    <div className="controlCantidad">
                                        <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}><Minus size={16} /></button>
                                        <span>{item.cantidad}</span>
                                        <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}><Plus size={16} /></button>
                                    </div>
                                    <button className="botonEliminar" onClick={() => eliminarDelCarrito(item.id)}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <aside className="resumenPedido efectoVidrioUltra">
                            <h2>Resumen</h2>
                            <div className="filaResumen">
                                <span>Subtotal</span>
                                <span>{"₡" + precioTotal.toLocaleString()}</span>
                            </div>
                            <div className="filaResumen total">
                                <span>Total</span>
                                <span>{"₡" + precioTotal.toLocaleString()}</span>
                            </div>
                            <button className="botonPrimario anchoTotal" onClick={finalizarCompra} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                <ShoppingBag size={18} /> Finalizar Compra
                            </button>
                            <button className="botonSecundario anchoTotal" onClick={vaciarCarrito}>Vaciar Carrito</button>
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}

export default Carrito
