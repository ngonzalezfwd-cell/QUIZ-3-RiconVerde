import React from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import "./Navbar.css"

function Navbar() {
  const ubicacion = useLocation()
  const navegar = useNavigate()
  const esAuth = ubicacion.pathname === "/login" || ubicacion.pathname === "/registro"

  const irASeccion = (e, id) => {
    e.preventDefault()
    if (ubicacion.pathname !== "/") {
      navegar("/")
      setTimeout(() => {
        const elemento = document.getElementById(id)
        if (elemento) {
          const compensacion = -80 // Compensa la cabecera fija
          const posicionCuerpo = document.body.getBoundingClientRect().top
          const posicionElemento = elemento.getBoundingClientRect().top
          const offsetPosition = posicionElemento - posicionCuerpo + compensacion
          window.scrollTo({ top: offsetPosition, behavior: "smooth" })
        }
      }, 150)
    } else {
      const elemento = document.getElementById(id)
      if (elemento) {
        const compensacion = -80
        const posicionCuerpo = document.body.getBoundingClientRect().top
        const posicionElemento = elemento.getBoundingClientRect().top
        const offsetPosition = posicionElemento - posicionCuerpo + compensacion
        window.scrollTo({ top: offsetPosition, behavior: "smooth" })
      }
    }
  }

  return (
    <nav id="navegacionPrincipal">
      <ul className="listaNavegacion">
        {!esAuth && (
          <>
            <li><NavLink to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="enlaces">Inicio</NavLink></li>
            <li><a href="#bloquesCategorias" onClick={(e) => irASeccion(e, "bloquesCategorias")} className="enlaces">Categorías</a></li>
            <li><a href="#seccionDestacadas" onClick={(e) => irASeccion(e, "seccionDestacadas")} className="enlaces">Plantas</a></li>
            <li><a href="#seccionAccesorios" onClick={(e) => irASeccion(e, "seccionAccesorios")} className="enlaces">Productos</a></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
