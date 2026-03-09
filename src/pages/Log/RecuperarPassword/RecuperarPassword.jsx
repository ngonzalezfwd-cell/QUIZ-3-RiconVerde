import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import emailjs from "@emailjs/browser"
import Swal from "sweetalert2"
import { ArrowLeft } from "lucide-react"
import UserServices from "../../../services/UserService"
import "../Login-Register.css"

function RecuperarPassword() {
    const [paso, setPaso] = useState(1) // 1: Pedir correo, 2: Pedir código, 3: Pedir nueva contraseña
    const [correo, setCorreo] = useState("")
    const [codigoEnviado, setCodigoEnviado] = useState("")
    const [codigoIngresado, setCodigoIngresado] = useState("")
    const [nuevaPassword, setNuevaPassword] = useState("")
    const [usuarioId, setUsuarioId] = useState(null)
    const navegar = useNavigate()

    const enviarCodigo = async (e) => {
        if (e) e.preventDefault()

        if (correo.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Campo vacío",
                text: "Por favor, ingresa tu correo electrónico.",
                confirmButtonColor: "#2E4630"
            })
            return
        }

        const usuarios = await UserServices.GetUsuarios()
        const usuario = usuarios.find(u => u.correo === correo)

        if (!usuario) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No existe ninguna cuenta con este correo.",
                confirmButtonColor: "#2E4630"
            })
            return
        }

        // Generar código de recuperación de 6 caracteres
        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()
        setCodigoEnviado(codigo)
        setUsuarioId(usuario.id)

        // Parámetros para EmailJS
        const templateParams = {
            user_name: usuario.nombre,
            user_email: correo,
            recovery_code: codigo
        }

        try {
            // Nota: Aquí debes colocar TUS CREADENCIALES de EmailJS para que envíe el correo real.
            // Si no tienes credenciales aún, el catch permitirá continuar para propósitos de prueba mostrando el código.
            await emailjs.send(
                'service_default', // Reemplaza con tu Service ID
                'template_default', // Reemplaza con tu Template ID
                templateParams,
                'public_key' // Reemplaza con tu Public Key
            )

            Swal.fire({
                icon: "success",
                title: "¡Correo enviado!",
                text: "Te hemos enviado un código de recuperación. Revisa tu bandeja de entrada o spam.",
                confirmButtonColor: "#2E4630"
            })
            setPaso(2)
        } catch (error) {
            console.error("Error EmailJS:", error)
            // Para poder probar sin credenciales reales:
            Swal.fire({
                icon: "info",
                title: "Modo Simulación",
                text: "Como no hay credenciales de EmailJS configuradas, usa el código: " + codigo,
                confirmButtonColor: "#2E4630"
            })
            setPaso(2)
        }
    }

    const verificarCodigo = (e) => {
        if (e) e.preventDefault()

        if (codigoIngresado.trim().toUpperCase() === codigoEnviado) {
            Swal.fire({
                icon: "success",
                title: "Código verificado",
                text: "Ahora puedes ingresar tu nueva contraseña.",
                confirmButtonColor: "#2E4630",
                timer: 1500,
                showConfirmButton: false
            })
            setPaso(3)
        } else {
            Swal.fire({
                icon: "error",
                title: "Código incorrecto",
                text: "El código no coincide. Intenta de nuevo.",
                confirmButtonColor: "#2E4630"
            })
        }
    }

    const cambiarPassword = async (e) => {
        if (e) e.preventDefault()

        if (nuevaPassword.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Campo vacío",
                text: "Por favor ingresa una nueva contraseña.",
                confirmButtonColor: "#2E4630"
            })
            return
        }

        if (/[a-zA-Z]/.test(nuevaPassword)) {
            Swal.fire({
                icon: "error",
                title: "Contraseña inválida",
                text: "La contraseña no puede contener letras.",
                confirmButtonColor: "#2E4630"
            })
            return
        }

        // Actualizamos en bd.json
        await UserServices.PatchUsuarios(usuarioId, { contraseña: nuevaPassword })

        Swal.fire({
            icon: "success",
            title: "¡Contraseña actualizada!",
            text: "Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión.",
            confirmButtonColor: "#2E4630"
        }).then(() => {
            navegar("/login")
        })
    }

    return (
        <div id="paginaLogin">
            <main className="contenedorLogin animarEntrada">
                <div className="tarjetaAuth efectoVidrioUltra">
                    <Link to="/login" className="botonVolver" title="Volver al inicio de sesión">
                        <ArrowLeft size={24} /><span>Volver</span>
                    </Link>

                    <h2>Recuperar Contraseña</h2>

                    {paso === 1 && (
                        <section className="formularioAuth">
                            <p style={{ textAlign: "center", marginBottom: "1rem", color: "#4f4f4f", fontSize: "0.9rem" }}>
                                Ingresa el correo electrónico asociado a tu cuenta para enviarte un código de recuperación.
                            </p>
                            <div className="entrada">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    placeholder="tu@correo.com"
                                    required
                                />
                            </div>
                            <button type="button" className="botonPrimario anchoTotal" onClick={enviarCodigo}>
                                Enviar Código
                            </button>
                        </section>
                    )}

                    {paso === 2 && (
                        <section className="formularioAuth">
                            <p style={{ textAlign: "center", marginBottom: "1rem", color: "#4f4f4f", fontSize: "0.9rem" }}>
                                Hemos enviado un código a <strong>{correo}</strong>.
                            </p>
                            <div className="entrada">
                                <label>Código de Recuperación</label>
                                <input
                                    type="text"
                                    value={codigoIngresado}
                                    onChange={(e) => setCodigoIngresado(e.target.value)}
                                    placeholder="Ej: AB1295"
                                    required
                                />
                            </div>
                            <button type="button" className="botonPrimario anchoTotal" onClick={verificarCodigo}>
                                Verificar Código
                            </button>
                        </section>
                    )}

                    {paso === 3 && (
                        <section className="formularioAuth">
                            <p style={{ textAlign: "center", marginBottom: "1rem", color: "#4f4f4f", fontSize: "0.9rem" }}>
                                Crea una nueva contraseña para tu cuenta.
                            </p>
                            <div className="entrada">
                                <label>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={nuevaPassword}
                                    onChange={(e) => setNuevaPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button type="button" className="botonPrimario anchoTotal" onClick={cambiarPassword}>
                                Guardar Contraseña
                            </button>
                        </section>
                    )}

                </div>
            </main>
        </div>
    )
}

export default RecuperarPassword
