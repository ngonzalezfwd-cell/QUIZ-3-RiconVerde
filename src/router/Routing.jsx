import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "../pages/Home/Home"
import Login from "../pages/Log/Login/Login"
import Registro from "../pages/Log/Registro/Registro"
import RecuperarPassword from "../pages/Log/RecuperarPassword/RecuperarPassword"
import Admin from "../pages/Admin/Admin"
import Carrito from "../pages/Carrito/Carrito"
import Plantas from "../pages/Plantas/Plantas"
import Productos from "../pages/Productos/Productos"

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<RecuperarPassword />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/plantas" element={<Plantas />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </Router>
  )
}

export default Routing