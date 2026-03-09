import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

{/* ICONOS Y LIBRERIAS */ }
import { Leaf, Package } from "lucide-react"
import Swal from "sweetalert2"

{/* COMPONENTES */ }
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

{/* IMPORTACIÓN DE CONTEXTO */ }
import { useCarrito } from "../../context/CarritoContext"
import PlantasService from "../../services/PlantService"
import ProductosService from "../../services/ProductService"
import "./Home.css"


function Home() {

  const [plantasDestacadas, setPlantasDestacadas] = useState([])
  const [productosDestacados, setProductosDestacados] = useState([])
  const [usuario, setUsuario] = useState(null)
  const { agregarAlCarrito } = useCarrito()
  const navegar = useNavigate()

  useEffect(() => {
    PlantasService.GetPlantas().then(data => {
      if (Array.isArray(data)) setPlantasDestacadas(data.slice(0, 3))
    })
    ProductosService.GetProductos().then(data => {
      if (Array.isArray(data)) setProductosDestacados(data.slice(0, 3))
    })

    const guardado = localStorage.getItem("usuarioSesion")
    if (guardado) setUsuario(JSON.parse(guardado))
  }, [])

  const manejarCompra = (item) => {
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

    if (item.stock <= 0) {
      Swal.fire({
        icon: "error",
        title: "Sin Stock",
        text: item.nombre + " no está disponible en este momento.",
        confirmButtonColor: "#184425"
      })
      return
    }

    agregarAlCarrito(item)
    Swal.fire({
      icon: "success",
      title: "Añadido",
      text: item.nombre + " se agregó al carrito.",
      timer: 1500,
      showConfirmButton: false
    })
  }


  {/* RETURN */ }
  return (


    <div id="paginaInicio">

      <Header />

      <main>

        <section id="Principal">

          <div className="contenedor">

            <div className="Texto">

              <span className="subtitulo">Bienvenido a tu</span>

              <h1>Refugio de Naturaleza</h1>
              <p>Donde encontrarás plantas, macetas y productos para el cuidado de tu jardín.</p>

              <div className="acciones">

                <a href="#bloquesCategorias" className="botonPrimario">Ver Categorías</a>
                <a href="#nuestraHistoria" className="botonSecundario">Nuestra Historia</a>
              </div>

            </div>
          </div>
        </section>


        <div className="contenedor">

          <section id="bloquesCategorias" className="seccionEspaciado">

            <div className="encabezadoSeccion revelado">
              <h2 className="tituloSeccion">Nuestras Secciones</h2>
              <p>Explora nuestras colecciones.</p>
            </div>

            <div className="cuadriculaCategorias">

              <Link to="/plantas" id="bloquePlanta" className="bloqueCategoria efectoVidrioUltra">

                <div className="bloqueContenido">

                  <Leaf size={48} />
                  <h3>Plantas</h3>
                  <p>Encuentra la planta perfecta para cada espacio y transforma tu hogar con un toque de naturaleza.</p>
                  <span className="bloqueFlecha">Explorar &rarr;</span>
                </div>

              </Link>

              <Link to="/productos" id="bloqueProducto" className="bloqueCategoria efectoVidrioUltra">

                <div className="bloqueContenido">

                  <Package size={48} />
                  <h3>Accesorios y Herramientas</h3>
                  <p>Productos diseñados para mantener tus plantas sanas, fuertes y creciendo en las mejores condiciones.</p>
                  <span className="bloqueFlecha">Explorar &rarr;</span>
                </div>

              </Link>

              <div id="LineaDivisora"></div>

            </div>

          </section>


          <section id="seccionDestacadas" className="seccionEspaciado">

            <div className="encabezadoSeccion revelado">

              <h2 className="tituloSeccion">Plantas Destacadas</h2>
              <p>Una muestra de nuestra colección más exclusiva.</p>
            </div>


            <div className="cuadriculaPremium">

              {plantasDestacadas.map((planta, i) => (
                <article key={planta.id} className="tarjetaInteractiva revelado" style={{ animationDelay: (i * 0.1) + "s" }}>

                  <div className="capaImagen">

                    <img src={planta.imagen} alt={planta.nombre} className="imagenPremium" />
                    <span className="etiquetaCategoria">{planta.categoria}</span>
                  </div>

                  <div className="contenidoTarjeta">

                    <h3>{planta.nombre}</h3>
                    <p className="descripcionBreve">{planta.descripcion}</p>

                    <div className="pieTarjeta">

                      <span className="precioPremium">{"₡" + planta.precio.toLocaleString()}</span>
                      <button className="botonCompra" onClick={() => manejarCompra(planta)}>Añadir</button>
                    </div>

                  </div>

                </article>
              ))}
            </div>

            <div className="centrarBoton">

              <Link to="/plantas" className="botonSecundario">Ver todas las plantas</Link>
            </div>
          </section>

          <section id="bannerPromocional" className="bannerRevelado revelado">

            <div className="bannerContenido">

              <h2>Cuidado Orgánico</h2>
              <p>Todo lo que necesita para que sus plantas prosperen.</p>
            </div>
          </section>

          <section id="seccionAccesorios" className="seccionEspaciado">

            <div className="encabezadoSeccion revelado">

              <h2 className="tituloSeccion">Accesorios Destacados</h2>
              <p>Complementos diseñados con funcionalidad y estilo.</p>
            </div>

            <div className="cuadriculaPremium">

              {productosDestacados.map((producto, index) => (

                <article key={producto.id} className="tarjetaInteractiva revelado" style={{ animationDelay: (index * 0.1) + "s" }}>

                  <div className="capaImagen">
                    <img src={producto.imagen} alt={producto.nombre} className="imagenPremium" />
                    <span className="etiquetaCategoria">{producto.categoria}</span>
                  </div>

                  <div className="contenidoTarjeta">

                    <h3>{producto.nombre}</h3>
                    <p className="descripcionBreve">{producto.descripcion}</p>

                    <div className="pieTarjeta">

                      <span className="precioPremium">{"₡" + producto.precio.toLocaleString()}</span>
                      <button className="botonCompra" onClick={() => manejarCompra(producto)}>Añadir</button>
                    </div>

                  </div>
                </article>
              ))}
            </div>

            <div className="centrarBoton">
              <Link to="/productos" className="botonSecundario">Ver todos los accesorios</Link>
            </div>

          </section>


          <section id="nuestraHistoria" className="seccionEspaciado">

            <div className="historiaContenedor efectoVidrioUltra revelado">

              <div className="historiaLayout">
                <div className="historiaTexto">
                  <span className="historiaSubtitulo">Conócenos</span>
                  <h2>Nuestra Historia</h2>
                  <p>
                    En <strong>Rincón Verde</strong>, creemos que la naturaleza tiene el poder de transformar espacios y mejorar nuestras vidas. Todo comenzó como un pequeño sueño en el jardín trasero de una casa, donde cultivábamos nuestras primeras suculentas y plantas de interior.
                  </p>

                  <p>
                    Con el paso de los meses, esa pasión germinó y se convirtió en lo que hoy conoces: un refugio dedicado a conectar a las personas con el mundo botánico. Nuestro equipo trabaja incansablemente para traerte no solo las plantas más saludables, sino también el conocimiento y las herramientas para que prosperen contigo.
                  </p>

                  <div className="valoresHistoria">
                    <div className="valorItem">
                      <span className="valorNumero">+5</span>
                      <span className="valorTexto">Años de xperiencia</span>
                    </div>
                    <div className="valorItem">
                      <span className="valorNumero">+1k</span>
                      <span className="valorTexto">Plantas entregadas</span>
                    </div>
                  </div>
                </div>

                <div className="historiaImagenContenedor">
                  <img src="https://images.unsplash.com/photo-1598512752271-33f913a5af13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Nuestra historia" className="historiaImagenPrincipal" />
                  <div className="historiaDecoracion"></div>
                </div>
              </div>

            </div>

          </section>

        </div>

      </main >

      <Footer />

    </div >
  )
}

export default Home
