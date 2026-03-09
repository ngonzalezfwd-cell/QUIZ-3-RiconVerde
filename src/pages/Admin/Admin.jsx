import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Trash2, UserStar, Edit, Plus, Users, Leaf, Package, UserMinus, ShoppingCart, Eye } from "lucide-react"

import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import UserServices from "../../services/UserService"
import PlantService from "../../services/PlantService"
import ProductService from "../../services/ProductService"
import PedidoService from "../../services/PedidoService"
import "./Admin.css"

function Admin() {

    const [usuarios, setUsuarios] = useState([])
    const [plantas, setPlantas] = useState([])
    const [productos, setProductos] = useState([])
    const [pedidos, setPedidos] = useState([])
    const [pestanaActiva, setPestanaActiva] = useState("usuarios")
    const navegar = useNavigate()

    useEffect(() => {

        const guardado = localStorage.getItem("usuarioSesion")
        if (!guardado) { navegar("/login"); return }

        const usuarioSesion = JSON.parse(guardado)
        if (usuarioSesion.rol !== "admin") {
            Swal.fire({
                icon: "error",
                title: "Acceso Denegado",
                text: "Solo administradores pueden entrar aquí.",
                confirmButtonColor: "#184425"
            })
            navegar("/")
            return
        }
        cargarDatos()
    }, [navegar])

    const cargarDatos = async () => {
        const [u, pl, pr, pd] = await Promise.all([
            UserServices.GetUsuarios(),
            PlantService.GetPlantas(),
            ProductService.GetProductos(),
            PedidoService.GetPedidos()
        ])
        setUsuarios(u || [])
        setPlantas(pl || [])
        setProductos(pr || [])
        setPedidos(pd || [])
    }

    const manejarRol = async (usuario) => {
        const guardado = localStorage.getItem("usuarioSesion");
        if (guardado) {
            const adminActual = JSON.parse(guardado);
            if (adminActual.id === usuario.id) {
                Swal.fire({
                    icon: "error",
                    title: "Acción Inválida",
                    text: "No puedes cambiar tu propio rol de administrador.",
                    confirmButtonColor: "#2E4630"
                });
                return;
            }
        }

        const nuevoRol = usuario.rol === "admin" ? "user" : "admin"

        const response = await Swal.fire({
            title: "¿Cambiar rol?",
            text: "¿Quieres cambiar el rol de este usuario a " + nuevoRol.toUpperCase() + "?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2E4630",
            cancelButtonColor: "#e53e3e",
            confirmButtonText: "Sí, cambiar rol",
            cancelButtonText: "Cancelar"
        })
        if (response.isConfirmed) {

            await UserServices.PatchUsuarios(usuario.id, { rol: nuevoRol })
            cargarDatos()

            Swal.fire({
                title: "Rol actualizado",
                text: "El usuario ahora tiene rol de " + nuevoRol + ".",
                icon: "success",
                confirmButtonColor: "#2E4630"
            })
        }
    }

    const eliminarUsuario = async (id) => {
        const resultado = await Swal.fire({
            title: "¿Eliminar usuario?",
            text: "Esta acción es irreversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#2E4630",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        })
        if (resultado.isConfirmed) {
            await UserServices.DeleteUsuarios(id)
            cargarDatos()
            Swal.fire({
                title: "Eliminado",
                text: "Usuario eliminado con éxito.",
                icon: "success",
                confirmButtonColor: "#2E4630"
            })
        }
    }

    const editarUsuarioAdmin = async (usuario) => {
        const { value } = await Swal.fire({
            title: "Editar Usuario",
            html: `
                <div style="display:flex; flex-direction:column; gap: 10px; margin-top:15px; text-align: left;">
                    <label style="font-size: 13px; font-weight: bold; color: #184425;">Nombre</label>
                    <input id="inputNombreUsu" class="swal2-input" value="${usuario.nombre}" style="margin:0;">
                    <label style="font-size: 13px; font-weight: bold; color: #184425;">Correo</label>
                    <input id="inputCorreoUsu" type="email" class="swal2-input" value="${usuario.correo}" style="margin:0;">
                    <label style="font-size: 13px; font-weight: bold; color: #184425;">Teléfono</label>
                    <input id="inputTelUsu" type="tel" class="swal2-input" value="${usuario.telefono || ""}" style="margin:0;">
                    <label style="font-size: 13px; font-weight: bold; color: #184425;">Edad</label>
                    <input id="inputEdadUsu" type="number" class="swal2-input" value="${usuario.edad || ""}" style="margin:0;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                        <input type="checkbox" id="checkBorrarFoto" style="width: 18px; height: 18px; cursor: pointer;">
                        <label for="checkBorrarFoto" style="cursor: pointer; color: #e53e3e; font-weight: bold;">Eliminar foto de perfil actual</label>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: "#2E4630",
            confirmButtonText: "Guardar Cambios",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                const nombre = document.getElementById("inputNombreUsu").value.trim()
                const correo = document.getElementById("inputCorreoUsu").value.trim()
                const telefono = document.getElementById("inputTelUsu").value.trim()
                const edad = document.getElementById("inputEdadUsu").value.trim()
                const borrarFoto = document.getElementById("checkBorrarFoto").checked

                // Validaciones
                if (!nombre || !correo || !edad) {
                    Swal.showValidationMessage("Nombre, correo y edad son obligatorios")
                    return false
                }

                if (/\\d/.test(nombre)) {
                    Swal.showValidationMessage("El nombre no puede contener números")
                    return false
                }

                if (!correo.includes("@") || !correo.includes(".")) {
                    Swal.showValidationMessage("Formato de correo inválido")
                    return false
                }

                if (Number(edad) < 0 || Number(telefono) < 0) {
                    Swal.showValidationMessage("La edad y el teléfono no pueden ser negativos")
                    return false
                }

                const hayCambios =
                    nombre !== usuario.nombre ||
                    correo !== usuario.correo ||
                    telefono !== (usuario.telefono || "") ||
                    edad !== (usuario.edad || "") ||
                    borrarFoto;

                if (!hayCambios) {
                    Swal.showValidationMessage("No has realizado ningún cambio.")
                    return false
                }

                const newData = { nombre, correo, telefono, edad }
                if (borrarFoto && usuario.imagenPerfil) {
                    newData.imagenPerfil = ""
                }

                return newData
            }
        })

        if (value) {
            await UserServices.PatchUsuarios(usuario.id, value)
            cargarDatos()
            Swal.fire({
                title: "Usuario actualizado",
                text: "Los datos han sido guardados.",
                icon: "success",
                confirmButtonColor: "#2E4630"
            })
        }
    }

    const gestionarItem = async (tipo, item = null) => {

        const editar = !!item

        const opcionesSelect = tipo === "plantas"
            ? "<option value='' disabled " + (!editar ? "selected" : "") + ">Selecciona una Categoría</option>" +
            "<option value='Plantas' " + (editar && item.categoria === 'Plantas' ? "selected" : "") + ">Plantas</option>" +
            "<option value='Exterior' " + (editar && item.categoria === 'Exterior' ? "selected" : "") + ">Exterior</option>" +
            "<option value='Suculentas' " + (editar && item.categoria === 'Suculentas' ? "selected" : "") + ">Suculentas</option>"
            : "<option value='' disabled " + (!editar ? "selected" : "") + ">Selecciona una Categoría</option>" +
            "<option value='Abonos' " + (editar && item.categoria === 'Abonos' ? "selected" : "") + ">Abonos</option>" +
            "<option value='Herramientas' " + (editar && item.categoria === 'Herramientas' ? "selected" : "") + ">Herramientas</option>" +
            "<option value='Macetas' " + (editar && item.categoria === 'Macetas' ? "selected" : "") + ">Macetas</option>" +
            "<option value='Accesorios' " + (editar && item.categoria === 'Accesorios' ? "selected" : "") + ">Accesorios</option>";

        const { value } = await Swal.fire({
            title: (editar ? "Editar" : "Nuevo") + " " + (tipo === "plantas" ? "Planta" : "Producto"),
            html:
                "<div style=\"display:flex; flex-direction:column; gap: 10px; margin-top:15px; align-items: center;\">" +
                "<div id=\"contenedorPreviewItem\" style=\"position: relative; cursor: pointer; width: 140px; height: 140px; border-radius: 20px; border: 4px solid #184425; overflow: hidden; background: #f0f0f0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 5px;\">" +
                "<img id=\"previewImagenItem\" src=\"" + (editar && item.imagen ? item.imagen : "https://cdn-icons-png.flaticon.com/512/11500/11500366.png") + "\" style=\"width: 100%; height: 100%; object-fit: cover;\">" +
                "<div style=\"position: absolute; bottom: 0; width: 100%; background: rgba(24, 68, 37, 0.8); color: white; font-size: 11px; padding: 5px 0; text-align: center; font-weight: bold;\">CAMBIAR FOTO</div>" +
                "</div>" +
                "<input type=\"file\" id=\"inputFileItem\" accept=\"image/*\" style=\"display: none;\">" +
                "<input id=\"inputNombre\" class=\"swal2-input\" placeholder=\"Nombre\" value=\"" + (editar ? item.nombre : "") + "\" style=\"margin:0; width: 100%;\">" +
                "<input id=\"inputDesc\" class=\"swal2-input\" placeholder=\"Descripción\" value=\"" + (editar ? item.descripcion : "") + "\" style=\"margin:0; width: 100%;\">" +
                "<div style=\"display:flex; gap: 10px; width: 100%;\">" +
                "<input id=\"inputPrecio\" class=\"swal2-input\" type=\"number\" placeholder=\"Precio\" value=\"" + (editar ? item.precio : "") + "\" style=\"margin:0; width:50%;\">" +
                "<input id=\"inputStock\" class=\"swal2-input\" type=\"number\" placeholder=\"Stock\" value=\"" + (editar ? item.stock : "") + "\" style=\"margin:0; width:50%;\">" +
                "</div>" +
                "<select id=\"inputCategoria\" class=\"swal2-input\" style=\"margin:0; width: 100%;\">" +
                opcionesSelect +
                "</select>" +
                "</div>",
            didOpen: () => {
                const contenedor = document.getElementById("contenedorPreviewItem");
                const inputFile = document.getElementById("inputFileItem");
                const previewImg = document.getElementById("previewImagenItem");

                if (contenedor && inputFile) {
                    contenedor.onclick = () => inputFile.click();
                    inputFile.onchange = (e) => {
                        const archivo = e.target.files[0];
                        if (archivo) {
                            const lector = new FileReader();
                            lector.onload = (evento) => {
                                const img = new Image();
                                img.onload = () => {
                                    const canvas = document.createElement("canvas");
                                    const MAX_WIDTH = 800; // Fotos de productos a tamaño decente

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
                                    previewImg.src = dataUrl;
                                }
                                img.src = evento.target.result;
                            };
                            lector.readAsDataURL(archivo);
                        }
                    };
                }
            },
            showCancelButton: true,
            confirmButtonColor: "#2E4630",
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                const img = document.getElementById("previewImagenItem").src;
                const nom = document.getElementById("inputNombre").value.trim();
                const desc = document.getElementById("inputDesc").value.trim();
                const prec = document.getElementById("inputPrecio").value;
                const stk = document.getElementById("inputStock").value;
                const cat = document.getElementById("inputCategoria").value;

                if (!nom || !desc || !prec || !stk || !cat) {
                    Swal.showValidationMessage("Todos los campos son obligatorios.");
                    return false;
                }

                if (/\d/.test(nom)) {
                    Swal.showValidationMessage("El nombre no puede contener números.");
                    return false;
                }

                if (nom.length < 3) {
                    Swal.showValidationMessage("El nombre debe tener al menos 3 caracteres.");
                    return false;
                }

                if (desc.length < 10) {
                    Swal.showValidationMessage("La descripción debe tener al menos 10 caracteres.");
                    return false;
                }

                if (Number(prec) <= 0) {
                    Swal.showValidationMessage("El precio debe ser mayor a 0.");
                    return false;
                }

                if (Number(stk) < 0) {
                    Swal.showValidationMessage("El stock no puede ser negativo.");
                    return false;
                }

                if (!Number.isInteger(Number(stk))) {
                    Swal.showValidationMessage("El stock debe ser un número entero.");
                    return false;
                }

                if (!editar && img.includes("flaticon.com")) {
                    Swal.showValidationMessage("Debes subir una imagen para el nuevo elemento.");
                    return false;
                }

                if (editar) {
                    const sinCambios =
                        nom === item.nombre &&
                        desc === item.descripcion &&
                        Number(prec) === item.precio &&
                        Number(stk) === item.stock &&
                        cat === item.categoria &&
                        img === item.imagen;

                    if (sinCambios) {
                        Swal.showValidationMessage("No has realizado ningún cambio.");
                        return false;
                    }
                }

                return {
                    id: editar ? item.id : Date.now().toString(),
                    imagen: img,
                    nombre: nom,
                    descripcion: desc,
                    precio: Number(prec),
                    stock: Number(stk),
                    categoria: cat
                }
            }
        })

        if (value) {
            const esPlanta = tipo === "plantas"
            const etiqueta = esPlanta ? "Planta" : "Producto"

            try {
                if (esPlanta) {
                    if (editar) {
                        await PlantService.PatchPlantas(item.id, value)
                    } else {
                        await PlantService.PostPlantas(value)
                    }
                } else {
                    if (editar) {
                        await ProductService.PatchProductos(item.id, value)
                    } else {
                        await ProductService.PostProductos(value)
                    }
                }
                cargarDatos()

                Swal.fire({
                    icon: "success",
                    title: editar ? etiqueta + " Actualizado" : etiqueta + " Creado",
                    text: editar
                        ? "\"" + value.nombre + "\" se actualizó correctamente."
                        : "\"" + value.nombre + "\" se añadió al catálogo exitosamente.",
                    confirmButtonColor: "#2E4630"
                })
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error al guardar. Intenta de nuevo.",
                    confirmButtonColor: "#e53e3e"
                })
            }
        }
    }

    const borrarItem = async (id, tipo) => {
        const resultado = await Swal.fire({
            title: "¿Eliminar elemento?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#2E4630",
            confirmButtonText: "Sí, borrar",
            cancelButtonText: "Cancelar"
        })
        if (resultado.isConfirmed) {
            if (tipo === "plantas") {
                await PlantService.DeletePlantas(id)
            } else {
                await ProductService.DeleteProductos(id)
            }
            cargarDatos()
            Swal.fire({
                title: "Eliminado",
                text: "El elemento ha sido removido del catálogo.",
                icon: "success",
                confirmButtonColor: "#2E4630"
            })
        }
    }

    return (

        <div id="paginaAdmin">

            <Header />

            <main className="contenedor espaciadoSuperior">

                <div className="encabezadoPanel">

                    <h1 className="tituloSeccion">Panel Administrativo</h1>

                    <div className="pestañasAdmin">

                        <button className={pestanaActiva === "usuarios" ? "activa" : ""} onClick={() => setPestanaActiva("usuarios")}><Users size={18} /> Usuarios</button>
                        <button className={pestanaActiva === "plantas" ? "activa" : ""} onClick={() => setPestanaActiva("plantas")}><Leaf size={18} /> Plantas</button>
                        <button className={pestanaActiva === "productos" ? "activa" : ""} onClick={() => setPestanaActiva("productos")}><Package size={18} /> Productos</button>
                        <button className={pestanaActiva === "pedidos" ? "activa" : ""} onClick={() => setPestanaActiva("pedidos")} style={{ position: "relative" }}>
                            <ShoppingCart size={18} /> Pedidos
                            {pedidos.filter(p => !p.visto).length > 0 && (
                                <span style={{
                                    position: "absolute", top: "-6px", right: "-6px",
                                    background: "#e53e3e", color: "white", borderRadius: "50%",
                                    width: "20px", height: "20px", fontSize: "11px", fontWeight: "900",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 2px 8px rgba(229,62,62,0.5)"
                                }}>
                                    {pedidos.filter(p => !p.visto).length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="contenidoPanel efectoVidrioUltra">

                    {pestanaActiva === "pedidos" ? (
                        <div id="gestionPedidos">
                            <div className="tituloTabla">
                                <h2>Pedidos Recibidos</h2>
                                <span style={{ color: "#718096", fontSize: "14px" }}>{pedidos.length} pedido(s) en total</span>
                            </div>
                            <table className="tablaAdmin">
                                <thead>
                                    <tr><th>Cliente</th><th>Correo</th><th>Items</th><th>Total</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr>
                                </thead>
                                <tbody>
                                    {pedidos.length === 0 ? (
                                        <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#718096" }}>No hay pedidos aún.</td></tr>
                                    ) : (
                                        pedidos.map(pedido => (
                                            <tr key={pedido.id} style={{ background: !pedido.visto ? "rgba(46,70,48,0.05)" : "transparent" }}>
                                                <td style={{ fontWeight: !pedido.visto ? "700" : "400" }}>
                                                    {!pedido.visto && <span style={{ display: "inline-block", width: "8px", height: "8px", background: "#e53e3e", borderRadius: "50%", marginRight: "8px" }}></span>}
                                                    {pedido.usuarioNombre}
                                                </td>
                                                <td>{pedido.usuarioCorreo}</td>
                                                <td>{pedido.items?.length || 0} artículo(s)</td>
                                                <td style={{ fontWeight: "700", color: "#2E4630" }}>₡{(pedido.total || 0).toLocaleString()}</td>
                                                <td style={{ fontSize: "13px" }}>{new Date(pedido.fecha).toLocaleDateString("es-CR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                                                <td><span className={"etiquetaRol " + (pedido.visto ? "user" : "admin")}>{pedido.visto ? "Visto" : "Nuevo"}</span></td>
                                                <td>
                                                    {!pedido.visto && (
                                                        <button className="btnIcono" title="Marcar como visto" onClick={async () => {
                                                            await PedidoService.PatchPedido(pedido.id, { visto: true })
                                                            cargarDatos()
                                                        }}><Eye size={16} /></button>
                                                    )}
                                                    <button className="btnIcono eliminar" title="Eliminar pedido" onClick={async () => {
                                                        const r = await Swal.fire({ title: "¿Eliminar pedido?", icon: "warning", showCancelButton: true, confirmButtonColor: "#e53e3e", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar" })
                                                        if (r.isConfirmed) { await PedidoService.DeletePedido(pedido.id); cargarDatos() }
                                                    }}><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : pestanaActiva === "usuarios" ? (

                        <div id="gestionUsuarios">

                            <table className="tablaAdmin">
                                <thead>
                                    <tr><th>Avatar</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (

                                        <tr key={u.id}>

                                            <td><img src={u.imagenPerfil || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="Avatar" className="imgMini" style={{ borderRadius: "50%" }} /></td>
                                            <td>{u.nombre}</td>
                                            <td>{u.correo}</td>
                                            <td><span className={"etiquetaRol " + (u.rol === "admin" ? "admin" : "user")}>{u.rol}</span></td>

                                            <td>
                                                <button onClick={() => manejarRol(u)} className="btnIcono" title="Cambiar Rol"><UserStar size={16} /></button>
                                                <button onClick={() => editarUsuarioAdmin(u)} className="btnIcono" title="Editar Perfil"><Edit size={16} /></button>
                                                <button onClick={() => eliminarUsuario(u.id)} className="btnIcono eliminar" title="Eliminar Usuario"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div id={"gestion" + pestanaActiva}>
                            <div className="tituloTabla">
                                <h2>{"Listado de " + pestanaActiva}</h2>
                                <button className="botonPrimario" onClick={() => gestionarItem(pestanaActiva)}><Plus size={18} /> Añadir</button>
                            </div>
                            <table className="tablaAdmin">
                                <thead>
                                    <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr>
                                </thead>
                                <tbody>
                                    {(pestanaActiva === "plantas" ? plantas : productos).map(item => (
                                        <tr key={item.id}>
                                            <td><img src={item.imagen} alt={item.nombre} className="imgMini" /></td>
                                            <td>{item.nombre}</td>
                                            <td>{"₡" + item.precio.toLocaleString()}</td>
                                            <td>
                                                <button onClick={() => gestionarItem(pestanaActiva, item)} className="btnIcono"><Edit size={16} /></button>
                                                <button onClick={() => borrarItem(item.id, pestanaActiva)} className="btnIcono eliminar"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Admin
