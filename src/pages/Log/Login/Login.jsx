import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import Swal from "sweetalert2"
import { ArrowLeft } from "lucide-react"

import "../Login-Register.css"
import UserServices from "../../../services/UserService"

function Login() {

    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    const navegar = useNavigate()

    const usuarioIniciar = async (e) => {
        if (e) e.preventDefault()

        if (correo.trim() === "" || contraseña.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Campos vacíos",
                text: "Por favor, riega los espacios con tu información.",
                confirmButtonColor: "#2E4630"
            })
            return
        }

        const usuarios = await UserServices.GetUsuarios()

        const usuario = usuarios.find(u => u.correo === correo && (u.contraseña === contraseña || u.contraseña === contraseña))

        if (!usuario) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Correo o contraseña incorrectos.",
                confirmButtonColor: "#2E4630"
            })
        } else {

            localStorage.setItem("usuarioSesion", JSON.stringify(usuario))

            Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: "¡Hola de nuevo " + usuario.nombre + "!",
                confirmButtonColor: "#2E4630"
            }).then(() => {

                if (usuario.rol === "admin") {
                    navegar("/admin")
                } else {
                    navegar("/")
                }
            })
        }
    }



    {/*PAGINA*/ }
    return (

        <div id="paginaLogin">

            <main className="contenedorLogin animarEntrada">

                <div className="tarjetaAuth efectoVidrioUltra">

                    <Link to="/" className="botonVolver" title="Volver al inicio">
                        <ArrowLeft size={24} /><span>Volver</span>
                    </Link>

                    <h2>Iniciar Sesión</h2>
                    <section className="formularioAuth">
                        <div className="entrada">
                            <label>Correo Electrónico</label>
                            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tu@correo.com" required />
                        </div>

                        <div className="entrada">
                            <label>Contraseña</label>
                            <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} placeholder="••••••••" required />
                        </div>

                        <button type="submit" className="botonPrimario anchoTotal" onClick={usuarioIniciar}>Entrar</button>
                    </section>

                    <p className="textoCambio" style={{ marginBottom: "0.5rem" }}>
                        <Link to="/recuperar" style={{ fontWeight: "normal", fontSize: "0.95rem" }}>¿Olvidaste tu contraseña?</Link>
                    </p>

                    <p className="textoCambio">
                        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Login
