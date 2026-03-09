import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Swal from "sweetalert2"
import { ArrowLeft, Camera } from "lucide-react"
import UserServices from "../../../services/UserService"
import "../Login-Register.css"

function Registro() {
    const [imagenPerfil, setImagenPerfil] = useState("")
    const [nombre, setNombre] = useState("")
    const [edad, setEdad] = useState("")
    const [genero, setGenero] = useState("")
    const [telefono, setTelefono] = useState("")
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [confirmarContraseña, setConfirmarContraseña] = useState("")
    const navegar = useNavigate()

    const manejarCambioImagen = (e) => {
        const archivo = e.target.files[0]
        if (archivo) {
            const lector = new FileReader()
            lector.onload = (evento) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 500;

                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                    setImagenPerfil(dataUrl);
                }
                img.src = evento.target.result;
            }
            lector.readAsDataURL(archivo)
        }
    }

    const registrarUsuario = async (e) => {
        if (e) e.preventDefault()

        const usuariosExistentes = await UserServices.GetUsuarios()
        const correoRepetido = usuariosExistentes.find(u => u.correo === correo)

        if (correoRepetido) {
            Swal.fire({
                icon: "warning",
                title: "Correo ya registrado",
                text: "Este correo ya tiene una cuenta.",
                confirmButtonColor: "#184425"
            })
            return
        }

        if ([nombre, edad, genero, telefono, correo, contraseña, confirmarContraseña].some(campo => campo.trim() === "")) {
            Swal.fire({
                icon: "warning",
                title: "Campos vacíos",
                text: "Por favor riega los espacios con tu información.",
                confirmButtonColor: "#184425"
            })
            return
        }

        if (/\d/.test(nombre)) {
            Swal.fire({
                icon: "warning",
                title: "Nombre inválido",
                text: "El nombre no puede contener números.",
                confirmButtonColor: "#184425"
            })
            return
        }

        if (edad < 0) {
            Swal.fire({
                icon: "warning",
                title: "Edad inválida",
                text: "La edad no puede ser negativa.",
                confirmButtonColor: "#184425"
            })
            return
        }

        if (/[a-zA-Z]/.test(telefono)) {
            Swal.fire({
                icon: "warning",
                title: "Teléfono inválido",
                text: "El teléfono no puede contener letras.",
                confirmButtonColor: "#184425"
            })
            return
        }

        if (telefono < 0) {
            Swal.fire({
                icon: "warning",
                title: "Teléfono inválido",
                text: "El teléfono no puede ser negativo.",
                confirmButtonColor: "#184425"
            })
            return
        }

        if (!correo.includes("@") || !correo.includes(".")) {
            Swal.fire({
                icon: "warning",
                title: "Correo inválido",
                text: "El correo debe contener @ y .",
                confirmButtonColor: "#184425"
            })
            return
        }

        if (/[a-zA-Z]/.test(contraseña)) {
            Swal.fire({
                icon: "warning",
                title: "Contraseña inválida",
                text: "La contraseña no puede contener letras.",
                confirmButtonColor: "#184425"
            })
            return
        }

        if (contraseña.length < 8) {
            Swal.fire({
                icon: "warning",
                title: "Contraseña inválida",
                text: "La contraseña debe tener al menos 8 caracteres.",
                confirmButtonColor: "#184425"
            })
            return
        }

        if (contraseña !== confirmarContraseña) {
            Swal.fire({
                icon: "warning",
                title: "Contraseñas no coinciden",
                text: "Las contraseñas no son iguales.",
                confirmButtonColor: "#184425"
            })
            return
        }

        const nuevoUsuario = {
            nombre,
            edad,
            genero,
            telefono,
            correo,
            contraseña,
            imagenPerfil: imagenPerfil || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            rol: "user",
            id: Date.now().toString()
        }

        await UserServices.PostUsuarios(nuevoUsuario)
        Swal.fire({
            icon: "success",
            title: "Usuario registrado",
            text: "¡Bienviendo a nuestro huerto, " + nuevoUsuario.nombre + "!",
            confirmButtonColor: "#184425"
        }).then(() => navegar("/login"))
    }






    return (

        <div id="paginaRegistro">

            <main className="contenedorLogin animarEntrada">

                <div className="tarjetaAuth efectoVidrioUltra">

                    <Link to="/" className="botonVolver" title="Volver al inicio">
                        <ArrowLeft size={24} /><span>Volver</span>
                    </Link>

                    <h2>Crear Cuenta</h2>

                    <div className="contenedorAvatarRegistro">

                        <label htmlFor="inputFoto" className="labelAvatarRegistro" title="Subir foto de perfil">
                            {imagenPerfil ? (
                                <img src={imagenPerfil} alt="Previsualización" className="imgAvatarRegistro" />
                            ) : (
                                <div className="placeholderAvatarRegistro">
                                    <Camera size={40} /><span>Subir Foto</span>
                                </div>
                            )}
                        </label>

                        <input type="file" id="inputFoto" accept="image/*" onChange={manejarCambioImagen} style={{ display: "none" }} />
                    </div>

                    <section id="formularioRegistro" className="formularioAuth">

                        <div className="datosPersonales">

                            <div className="entrada">

                                <label>Nombre Completo</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Tu nombre" />
                            </div>

                            <div className="entrada">

                                <label>Edad</label>
                                <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required placeholder="18" />
                            </div>

                            <div className="entrada">

                                <label>Género</label>

                                <select value={genero} onChange={(e) => setGenero(e.target.value)} required>
                                    <option value="" disabled hidden>Selecciona tu género</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                        </div>

                        <div className="divisorVertical"></div>

                        <div className="datosCuenta">

                            <div className="entrada">

                                <label>Teléfono</label>
                                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required placeholder="0000-0000" />
                            </div>

                            <div className="entrada">

                                <label>Correo Electrónico</label>
                                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required placeholder="ejemplo@correo.com" />
                            </div>

                            <div className="filaEntradas">

                                <div className="entrada flex1">
                                    <label>Contraseña</label>
                                    <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required placeholder="••••••••" />
                                </div>

                                <div className="entrada flex1">
                                    <label>Confirmar</label>
                                    <input type="password" value={confirmarContraseña} onChange={(e) => setConfirmarContraseña(e.target.value)} required placeholder="••••••••" />
                                </div>

                            </div>

                            <button type="button" className="botonPrimario anchoTotal" onClick={registrarUsuario}>Registrarse</button>
                        </div>
                    </section>

                    <p className="textoCambio">
                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Registro
