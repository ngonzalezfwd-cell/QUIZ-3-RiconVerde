import React, { createContext, useState, useEffect, useContext } from "react"

const CarritoContext = createContext()

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem("carrito")
        return guardado ? JSON.parse(guardado) : []
    })

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }, [carrito])

    const agregarAlCarrito = (item) => {
        setCarrito(prev => {
            const existe = prev.find(i => i.id === item.id)
            if (existe) {
                return prev.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)
            }
            return [...prev, { ...item, cantidad: 1 }]
        })
    }

    const eliminarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(i => i.id !== id))
    }

    const actualizarCantidad = (id, cantidad) => {
        if (cantidad <= 0) {
            eliminarDelCarrito(id)
            return
        }
        setCarrito(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
    }

    const vaciarCarrito = () => {
        setCarrito([])
    }

    const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0)
    const precioTotal = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0)

    return (
        <CarritoContext.Provider value={{
            carrito,
            agregarAlCarrito,
            eliminarDelCarrito,
            actualizarCantidad,
            vaciarCarrito,
            totalItems,
            precioTotal
        }}>
            {children}
        </CarritoContext.Provider>
    )
}

export const useCarrito = () => {
    const context = useContext(CarritoContext)
    if (!context) {
        throw new Error("useCarrito debe usarse dentro de un CarritoProvider")
    }
    return context
}
