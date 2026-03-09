import React from "react"
import { useLocation } from "react-router-dom"
import "./Footer.css"

{/* ICONOS */ }
import { Instagram, Facebook } from "lucide-react"
import { FaTiktok } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

function Footer() {
    const ubicacion = useLocation()
    const esAuth = ubicacion.pathname === "/login" || ubicacion.pathname === "/registro"

    return (
        <footer id="piePagina" className="seccionEspaciado">
            {esAuth ? (<></>) : (
                <div className="contenedor piePaginaContenido">
                    {/* Columna 1: Marca y Redes */}
                    <div className="infoMarca">
                        <h2 className="logotipo">Rincón Verde</h2>
                        <p className="descripcionFooter">Tu santuario botánico. Ofrecemos especies selectas y accesorios premium para transformar tus espacios en oasis de tranquilidad.</p>
                        <div className="redesSociales">
                            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram /> </a>
                            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><Facebook /> </a>
                            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer"><FaTiktok /> </a>
                            <a href="https://twitter.com/" target="_blank" rel="noreferrer"><FaXTwitter /></a>
                        </div>
                    </div>

                    {/* Columna 2: Tienda */}
                    <div className="footer-columna enlacesRapidos">
                        <h3 className="titulo">Nuestra Tienda</h3>
                        <ul>
                            <li><a href="#seccionPlantas">Colección Botánica</a></li>
                            <li><a href="#seccionProductos">Macetas & Cerámica</a></li>
                        </ul>
                    </div>

                    {/* Columna 3: Atención al Cliente */}
                    <div className="footer-columna enlacesRapidos">
                        <h3>Atención al Cliente</h3>
                        <ul>
                            <li><a href="#">Envíos y Entregas</a></li>
                            <li><a href="#">Política de Devoluciones</a></li>
                            <li><a href="#">Guía de Cuidados</a></li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div className="footer-columna infoContacto">
                        <h3>Contacto</h3>
                        <ul className="listaContacto">
                            <li><span>Email:</span> gnaomy276@gmail.com</li>
                            <li><span>Teléfono:</span> 506+ 8458-6719</li>
                            <li><span>Horario:</span> Lun - Vie: 9am - 6pm</li>
                        </ul>
                    </div>

                    <div id="derechosAutor" className="derechos">
                        <p>&copy; {new Date().getFullYear() + " Rincón Verde. Redefiniendo la vida natural en el hogar."}</p>
                    </div>
                </div>
            )}
        </footer>
    )
}

export default Footer
