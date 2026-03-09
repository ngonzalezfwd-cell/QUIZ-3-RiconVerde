import React, { useState, useEffect } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import Navbar from "../Navbar/Navbar"
import "./Header.css"
import { ShoppingCart, User, Search, LogOut, Edit, Trash2, X, LayoutDashboard, Lock } from "lucide-react"
import { useCarrito } from "../../context/CarritoContext"
import UserService from "../../services/UserService"
import emailjs from "@emailjs/browser"

function Header() {
    const [scrolled, setScrolled] = useState(false)
    const { totalItems } = useCarrito()
    const [usuario, setUsuario] = useState(null)
    const [menuAbierto, setMenuAbierto] = useState(false)
    const navegar = useNavigate()

    const handleCerrarSesion = async () => {
        const resultado = await Swal.fire({
            title: "¿Cerrar sesión?",
            text: "¿Estás seguro de que deseas salir?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2E4630",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        })

        if (resultado.isConfirmed) {
            localStorage.removeItem("usuarioSesion")
            setUsuario(null)
            setMenuAbierto(false)
            Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                text: "¡Vuelve a cultivar pronto!",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navegar("/")
            })
        }
    }

    const handleEditarPerfil = async () => {
        const { value: valoresFormulario } = await Swal.fire({
            title: "Editar mi Perfil",
            width: "600px",
            html:
                "<div style=\"display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 10px; max-height: 70vh; overflow-y: auto;\">" +
                "<div id=\"contenedorPrevisualizacion\" style=\"width: 140px; height: 140px; border-radius: 50%; border: 4px solid #184425; overflow: hidden; position: relative; cursor: pointer; background: #f0f0f0; box-shadow: 0 5px 15px rgba(0,0,0,0.2);\">" +
                "<img id=\"imagenPrevisualizacion\" src=\"" + (usuario.imagenPerfil || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png") + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">" +
                "<div style=\"position: absolute; bottom: 0; width: 100%; background: rgba(24, 68, 37, 0.8); color: white; font-size: 11px; padding: 5px 0; text-align: center; font-weight: bold;\">CAMBIAR FOTO</div>" +
                "</div>" +
                "<input type=\"file\" id=\"inputArchivo\" accept=\"image/*\" style=\"display: none;\">" +

                "<div style=\"width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left;\">" +
                "<div><label style=\"font-weight: bold; font-size: 13px; color: #184425;\">Nombre</label><input id=\"inputNombre\" class=\"swal2-input\" placeholder=\"Nombre\" value=\"" + (usuario?.nombre || "") + "\" style=\"margin:5px 0; width: 100%;\"></div>" +
                "<div><label style=\"font-weight: bold; font-size: 13px; color: #184425;\">Edad</label><input id=\"inputEdad\" class=\"swal2-input\" placeholder=\"Edad\" type=\"number\" value=\"" + (usuario?.edad || "") + "\" style=\"margin:5px 0; width: 100%;\"></div>" +
                "<div><label style=\"font-weight: bold; font-size: 13px; color: #184425;\">Género</label><select id=\"inputGenero\" class=\"swal2-input\" style=\"margin:5px 0; width: 100%;\">" +
                "<option value=\"Masculino\" " + (usuario?.genero === "Masculino" ? "selected" : "") + ">Masculino</option>" +
                "<option value=\"Femenino\" " + (usuario?.genero === "Femenino" ? "selected" : "") + ">Femenino</option>" +
                "<option value=\"Otro\" " + (usuario?.genero === "Otro" ? "selected" : "") + ">Otro</option>" +
                "</select></div>" +
                "<div><label style=\"font-weight: bold; font-size: 13px; color: #184425;\">Teléfono</label><input id=\"inputTelefono\" class=\"swal2-input\" placeholder=\"Teléfono\" value=\"" + (usuario?.telefono || "") + "\" style=\"margin:5px 0; width: 100%;\"></div>" +
                "</div>",
            didOpen: () => {
                const contenedor = document.getElementById("contenedorPrevisualizacion")
                const inputArchivo = document.getElementById("inputArchivo")
                const imagenPrev = document.getElementById("imagenPrevisualizacion")
                if (contenedor) contenedor.onclick = () => inputArchivo.click()
                if (inputArchivo) {
                    inputArchivo.onchange = (e) => {
                        const archivo = e.target.files[0]
                        if (archivo) {
                            const lector = new FileReader()
                            lector.onload = (evento) => { imagenPrev.src = evento.target.result }
                            lector.readAsDataURL(archivo)
                        }
                    }
                }
            },
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Guardar todo",
            cancelButtonText: "Salir sin guardar",
            confirmButtonColor: "#2E4630",
            cancelButtonColor: "#666",
            preConfirm: () => {
                const data = {
                    nombre: document.getElementById("inputNombre").value.trim(),
                    edad: document.getElementById("inputEdad").value.trim(),
                    genero: document.getElementById("inputGenero").value,
                    telefono: document.getElementById("inputTelefono").value.trim(),
                    imagenPerfil: document.getElementById("imagenPrevisualizacion").src
                }

                // Verificar si hay cambios reales
                const hayCambios =
                    data.nombre !== usuario.nombre ||
                    data.edad !== usuario.edad ||
                    data.genero !== usuario.genero ||
                    data.telefono !== usuario.telefono ||
                    data.imagenPerfil !== usuario.imagenPerfil;

                if (!hayCambios) {
                    Swal.showValidationMessage("No has realizado ningún cambio.")
                    return false
                }

                if (/\d/.test(data.nombre)) {

                    Swal.showValidationMessage("El nombre no puede ser numeros.")
                    return false
                }

                if (data.edad < 0){
                     Swal.showValidationMessage("La edad no puede ser negativa.")
                    return false
                }

                if (data.telefono < 0) {
                    Swal.showValidationMessage("El telefono no puede ser negativo.")
                    return false
                }

                return data
            }
        })

        if (valoresFormulario) {
            try {
                const actualizado = await UserService.PatchUsuarios(usuario.id, valoresFormulario)
                localStorage.setItem("usuarioSesion", JSON.stringify(actualizado))
                setUsuario(actualizado)
                Swal.fire({
                    icon: "success",
                    title: "¡Perfil actualizado!",
                    text: "Tus datos se han guardado correctamente.",
                    confirmButtonColor: "#2E4630"
                })
            } catch (error) {
                Swal.fire("Error", "No se pudo actualizar la cuenta", "error")
            }
        }
    }

    const handleCambiarContrasena = async () => {
        const { value: valoresFormulario } = await Swal.fire({
            title: "Cambiar Contraseña",
            html:
                "<div style=\"display: flex; flex-direction: column; gap: 15px; padding: 10px;\">" +
                "<input id=\"inputPassActual\" class=\"swal2-input\" type=\"password\" placeholder=\"Contraseña Actual\" style=\"margin:0;\">" +
                "<input id=\"inputPassNueva\" class=\"swal2-input\" type=\"password\" placeholder=\"Nueva Contraseña\" style=\"margin:0;\">" +
                "<input id=\"inputConfirmarPass\" class=\"swal2-input\" type=\"password\" placeholder=\"Confirmar Nueva Contraseña\" style=\"margin:0;\">" +
                "</div>",
            footer: "<button id=\"botonOlvido\" style=\"background:none; border:none; color:#2E4630; cursor:pointer; text-decoration:underline; font-family: Arial;\">¿Olvidaste tu contraseña?</button>",
            didOpen: () => {
                const botonOlvido = document.getElementById("botonOlvido")
                if (botonOlvido) {
                    botonOlvido.onclick = () => {
                        Swal.close()
                        handleRecuperarContrasena()
                    }
                }
            },
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#2E4630",
            preConfirm: () => {
                const actual = document.getElementById("inputPassActual").value
                const nueva = document.getElementById("inputPassNueva").value
                const confirmar = document.getElementById("inputConfirmarPass").value

                if (!actual || !nueva || !confirmar) {
                    Swal.showValidationMessage("Por favor llena todos los campos")
                    return false
                }
                if (actual !== usuario.contraseña) {
                    Swal.showValidationMessage("La contraseña actual es incorrecta")
                    return false
                }
                if (nueva.length < 8) {
                    Swal.showValidationMessage("La nueva contraseña debe tener al menos 8 caracteres")
                    return false
                }
                if (nueva !== confirmar) {
                    Swal.showValidationMessage("Las nuevas contraseñas no coinciden")
                    return false
                }
                return nueva
            }
        })

        if (valoresFormulario) {
            try {
                const actualizado = await UserService.PatchUsuarios(usuario.id, { contraseña: valoresFormulario })
                localStorage.setItem("usuarioSesion", JSON.stringify(actualizado))
                setUsuario(actualizado)
                Swal.fire("¡Éxito!", "Contraseña actualizada correctamente.", "success")
            } catch (error) {
                Swal.fire("Error", "No se pudo actualizar la contraseña", "error")
            }
        }
    }

    const handleRecuperarContrasena = async () => {
        const { value: correo } = await Swal.fire({
            title: "Recuperar Contraseña",
            text: "Ingresa tu correo electrónico:",
            input: "email",
            inputPlaceholder: "ejemplo@correo.com",
            showCancelButton: true,
            confirmButtonText: "Enviar código",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#2E4630",
        })

        if (!correo) return;

        const usuarios = await UserService.GetUsuarios()
        const usuarioEncontrado = usuarios.find(u => u.correo === correo)

        if (!usuarioEncontrado) {
            Swal.fire("Error", "No existe ninguna cuenta con este correo.", "error")
            return
        }

        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()

        try {
            await emailjs.send(
                'service_default',
                'template_default',
                { user_name: usuarioEncontrado.nombre, user_email: correo, recovery_code: codigo },
                'public_key'
            )
            await Swal.fire({
                icon: "success",
                title: "¡Correo enviado!",
                text: "Te hemos enviado un código de recuperación.",
                confirmButtonColor: "#2E4630"
            })
        } catch (error) {
            await Swal.fire({
                icon: "info",
                title: "Modo Simulación",
                text: "Como no hay credenciales de EmailJS configuradas, usa el código: " + codigo,
                confirmButtonColor: "#2E4630"
            })
        }

        const { value: codigoIngresado } = await Swal.fire({
            title: "Verificar Código",
            input: "text",
            inputPlaceholder: "Ingresa el código",
            showCancelButton: true,
            confirmButtonText: "Verificar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#2E4630"
        })

        if (!codigoIngresado || codigoIngresado.trim().toUpperCase() !== codigo) {
            Swal.fire("Error", "Código incorrecto o cancelado.", "error")
            return
        }

        const { value: nuevaPassword } = await Swal.fire({
            title: "Nueva Contraseña",
            input: "password",
            inputPlaceholder: "Mínimo 8 caracteres",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#2E4630",
            inputValidator: (value) => {
                if (!value || value.trim() === "") {
                    return "La contraseña no puede estar vacía"
                }
                if (value.length < 8) {
                    return "La contraseña debe tener al menos 8 caracteres"
                }
            }
        })

        if (nuevaPassword) {
            try {
                const actualizado = await UserService.PatchUsuarios(usuarioEncontrado.id, { contraseña: nuevaPassword })

                // Si el usuario actual es el que recuperó, actualiza su sesión en vivo
                if (usuario && usuario.id === usuarioEncontrado.id) {
                    localStorage.setItem("usuarioSesion", JSON.stringify(actualizado))
                    setUsuario(actualizado)
                }
                Swal.fire("¡Éxito!", "Contraseña actualizada correctamente.", "success")
            } catch (error) {
                Swal.fire("Error", "Hubo un problema al actualizar la contraseña.", "error")
            }
        }
    }

    const handleDeleteAccount = async () => {
        const { value: contrasena } = await Swal.fire({
            title: "Eliminar Cuenta",
            text: "Para confirmar, ingresa tu contraseña:",
            input: "password",
            inputPlaceholder: "Tu contraseña",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#2E4630",
            confirmButtonText: "Eliminar permanentemente",
            cancelButtonText: "Cancelar"
        })

        if (contrasena) {
            if (contrasena === usuario.contraseña) {
                try {
                    await UserService.DeleteUsuarios(usuario.id)
                    localStorage.removeItem("usuarioSesion")
                    setUsuario(null)
                    setMenuAbierto(false)
                    Swal.fire("Eliminada", "Tu cuenta ha sido eliminada.", "success")
                    navegar("/")
                } catch (error) {
                    Swal.fire("Error", "No se pudo eliminar la cuenta", "error")
                }
            } else {
                Swal.fire("Error", "Contraseña incorrecta.", "error")
            }
        }
    }

    useEffect(() => {
        const manejarScroll = () => setScrolled(window.scrollY > 50)
        const verificarUsuario = () => {
            const guardado = localStorage.getItem("usuarioSesion")
            setUsuario(guardado ? JSON.parse(guardado) : null)
        }
        verificarUsuario()
        window.addEventListener("scroll", manejarScroll)
        window.addEventListener("storage", verificarUsuario)
        const intervalo = setInterval(verificarUsuario, 1000)
        return () => {
            window.removeEventListener("scroll", manejarScroll)
            window.removeEventListener("storage", verificarUsuario)
            if (intervalo) clearInterval(intervalo)
        }
    }, [])

    return (
        <>
            <header id="cabeceraPrincipal" className={scrolled ? "cabeceraActiva" : ""}>
                <div className="contenedor cabeceraContenido">
                    <Link to="/" id="logotipoSitio" className="logotipo">Rincón Verde</Link>
                    <Navbar />
                    <div className="iconosCabecera">
                        <NavLink to="/carrito" className="botonIcono" title="Carrito">
                            <ShoppingCart size={30} />
                            {(usuario && totalItems > 0) && <span className="puntoNotificacion">{totalItems}</span>}
                        </NavLink>
                        {usuario ? (
                            <button onClick={() => setMenuAbierto(true)} className="botonIcono" title="Mi Perfil"><User size={30} /></button>
                        ) : (
                            <NavLink to="/login" style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "var(--gradiente-bosque)",
                                color: "white",
                                padding: "8px 20px",
                                borderRadius: "30px",
                                textDecoration: "none",
                                fontWeight: "600",
                                fontSize: "14px",
                                transition: "var(--transicion-suave)",
                                boxShadow: "var(--sombra-suave)"
                            }} title="Iniciar Sesión">
                                Iniciar sesión
                            </NavLink>
                        )}
                    </div>
                </div>
            </header>

            <div className={"barraPerfil " + (menuAbierto ? "activa" : "")}>
                <div className="capaFondo" onClick={() => setMenuAbierto(false)}></div>
                <aside className="panelLateral efectoVidrioUltra">
                    <button className="botonCerrar" onClick={() => setMenuAbierto(false)}><X size={24} /></button>
                    <div className="perfilEncabezado">
                        <div className="perfilAvatar">
                            {usuario?.imagenPerfil ? (
                                <img src={usuario.imagenPerfil} alt="Perfil" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            ) : (
                                <User size={50} />
                            )}
                        </div>
                        <h3>{usuario?.nombre}</h3>
                        <p>{usuario?.correo}</p>
                    </div>
                    <div className="perfilInformacion">
                        <div className="informacionItem">
                            <span className="etiquetaInfo">Edad</span>
                            <span className="valorInfo">{usuario?.edad} años</span>
                        </div>
                        <div className="informacionItem">
                            <span className="etiquetaInfo">Teléfono</span>
                            <span className="valorInfo">{usuario?.telefono}</span>
                        </div>
                        <div className="informacionItem">
                            <span className="etiquetaInfo">Género</span>
                            <span className="valorInfo">{usuario?.genero}</span>
                        </div>
                    </div>
                    <nav className="perfilNavegacion">
                        <button className="itemNav" onClick={handleEditarPerfil}><Edit size={20} /><span>Editar mis datos</span></button>
                        <button className="itemNav" onClick={handleCambiarContrasena}><Lock size={20} /><span>Seguridad</span></button>
                        <button className="itemNav eliminar" onClick={handleDeleteAccount}><Trash2 size={20} /><span>Eliminar cuenta</span></button>
                        {usuario?.rol === "admin" && (
                            <Link to="/admin" className="itemNav admin" onClick={() => setMenuAbierto(false)}>
                                <LayoutDashboard size={20} /><span>Panel Admin</span>
                            </Link>
                        )}
                        <div className="divisorPerfil"></div>
                        <button className="itemNav cerrarSesion" onClick={handleCerrarSesion}><LogOut size={20} /><span>Cerrar Sesión</span></button>
                    </nav>
                </aside>
            </div>
        </>
    )
}

export default Header
