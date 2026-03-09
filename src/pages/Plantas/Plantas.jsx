import React, { useState, useEffect } from "react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import { useCarrito } from "../../context/CarritoContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import PlantService from "../../services/PlantService"
import "./Plantas.css"

function Plantas() {
    const [plantas, setPlantas] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [categoriaActiva, setCategoriaActiva] = useState("Todas")
    const { agregarAlCarrito } = useCarrito()
    const navegar = useNavigate()

    useEffect(() => {
        PlantService.GetPlantas().then(data => setPlantas(data || []))

        const guardado = localStorage.getItem("usuarioSesion")
        setUsuario(guardado ? JSON.parse(guardado) : null)
    }, [])

    const categoriasUnicas = ["Todas", ...new Set(plantas.map(p => p.categoria).filter(Boolean))]

    const plantasFiltradas = categoriaActiva === "Todas"
        ? plantas
        : plantas.filter(p => p.categoria === categoriaActiva)

    const manejarCompra = (planta) => {
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

        if (planta.stock <= 0) {
            Swal.fire({
                icon: "error",
                title: "Sin Stock",
                text: planta.nombre + " no está disponible en este momento.",
                confirmButtonColor: "#184425"
            })
            return
        }

        agregarAlCarrito(planta)
        Swal.fire({
            icon: "success",
            title: "Añadido al Carrito",
            text: planta.nombre + " se agregó correctamente.",
            timer: 1500,
            showConfirmButton: false
        })
    }

    return (
        <div id="paginaPlantas">
            <Header />

            <main>
                <section id="heroePlantas" className="heroeSeccion">
                    <div className="contenedor">
                        <div className="heroeSeccionTexto revelado">
                            <span className="subtituloHeroe">Catálogo Botánico</span>
                            <h1>Plantas Exclusivas</h1>
                            <p>Una colección seleccionada de las especies más fascinantes del reino vegetal,
                                elegidas para elevar cualquier espacio a categoría de santuario natural.</p>
                        </div>
                    </div>
                </section>

                <div className="contenedor seccionEspaciado">

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

                    <div id="cuadriculaPlantas" className="cuadriculaPremium">
                        {plantasFiltradas.map((planta, index) => (
                            <article
                                key={planta.id}
                                className="tarjetaInteractiva revelado"
                                style={{ animationDelay: (index * 0.1) + "s" }}
                            >
                                <div className="capaImagen">
                                    <img src={planta.imagen} alt={planta.nombre} className="imagenPremium" />
                                    <span className="etiquetaCategoria">{planta.categoria}</span>
                                </div>
                                <div className="contenidoTarjeta">
                                    <h3>{planta.nombre}</h3>
                                    <p className="descripcionBreve">{planta.descripcion}</p>
                                    <div className="pieTarjeta">
                                        <span className="precioPremium">{"₡" + planta.precio.toLocaleString()}</span>
                                        <button className="botonCompra" onClick={() => manejarCompra(planta)}>
                                            Añadir al Carrito
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {plantasFiltradas.length === 0 && (
                        <div className="sinResultados">
                            <p>No hay plantas en la categoría "{categoriaActiva}".</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Plantas
