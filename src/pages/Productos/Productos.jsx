import React, { useState, useEffect } from "react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import { useCarrito } from "../../context/CarritoContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import ProductService from "../../services/ProductService"
import "./Productos.css"

function Productos() {
    const [productos, setProductos] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [categoriaActiva, setCategoriaActiva] = useState("Todas")
    const { agregarAlCarrito } = useCarrito()
    const navegar = useNavigate()

    useEffect(() => {
        ProductService.GetProductos().then(data => setProductos(data || []))

        const guardado = localStorage.getItem("usuarioSesion")
        setUsuario(guardado ? JSON.parse(guardado) : null)
    }, [])

    const categoriasUnicas = ["Todas", ...new Set(productos.map(p => p.categoria).filter(Boolean))]

    const productosFiltrados = categoriaActiva === "Todas"
        ? productos
        : productos.filter(p => p.categoria === categoriaActiva)

    const manejarCompra = (producto) => {
        if (!usuario) {
            Swal.fire({
                icon: "warning",
                title: "Sesión Requerida",
                text: "Debes iniciar sesión para poder comprar.",
                confirmButtonColor: "#184425",
                confirmButtonText: "Iniciar Sesión",
                showCancelButton: true,
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) navegar("/login")
            })
            return
        }

        if (producto.stock <= 0) {
            Swal.fire({
                icon: "error",
                title: "Sin Stock",
                text: producto.nombre + " no está disponible en este momento.",
                confirmButtonColor: "#184425"
            })
            return
        }

        agregarAlCarrito(producto)
        Swal.fire({
            icon: "success",
            title: "Añadido al Carrito",
            text: producto.nombre + " se agregó correctamente.",
            timer: 1500,
            showConfirmButton: false
        })
    }

    return (
        <div id="paginaProductos">
            <Header />

            <main>
                <section id="heroeProductos" className="heroeSeccionProducto">
                    <div className="contenedor">
                        <div className="heroeSeccionTexto revelado">
                            <span className="subtituloHeroe">Tienda de Accesorios</span>
                            <h1>Accesorios Premium</h1>
                            <p>Herramientas, macetas y suplementos seleccionados con rigor,
                                diseñados para el perfeccionista del jardín moderno.</p>
                        </div>
                    </div>
                </section>

                <div className="contenedor seccionEspaciadoProducto">

                    <div className="filtroCategorias">
                        {categoriasUnicas.map(cat => (
                            <button
                                key={cat}
                                className={"btnFiltro" + (categoriaActiva === cat ? " activo" : "")}
                                onClick={() => setCategoriaActiva(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div id="cuadriculaProductos" className="cuadriculaPremiumProducto">
                        {productosFiltrados.map((producto, index) => (
                            <article
                                key={producto.id}
                                className="tarjetaProducto revelado"
                                style={{ animationDelay: (index * 0.1) + "s" }}
                            >
                                <div className="capaImagenProducto">
                                    <img src={producto.imagen} alt={producto.nombre} className="imagenProducto" />
                                    <span className="etiquetaProducto">{producto.categoria}</span>
                                </div>
                                <div className="contenidoProducto">
                                    <h3>{producto.nombre}</h3>
                                    <p className="descripcionProducto">{producto.descripcion}</p>
                                    <div className="pieTarjetaProducto">
                                        <span className="precioProducto">{"₡" + producto.precio.toLocaleString()}</span>
                                        <button className="botonCompraProducto" onClick={() => manejarCompra(producto)}>
                                            Añadir al Carrito
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {productosFiltrados.length === 0 && (
                        <div className="sinResultados">
                            <p>No hay productos en la categoría "{categoriaActiva}".</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Productos
