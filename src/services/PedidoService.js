// GET
async function GetPedidos() {
    try {
        const response = await fetch("http://localhost:3000/Pedidos")
        const data = await response.json()
        return data
    } catch (error) {
        console.log("Error al obtener los Pedidos: " + error)
    }
}

// POST
async function PostPedidos(pedido) {
    try {
        const response = await fetch("http://localhost:3000/Pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log("Error al crear el Pedido: " + error)
    }
}

// PATCH (marcar como leído)
async function PatchPedido(id, datos) {
    try {
        const response = await fetch("http://localhost:3000/Pedidos/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log("Error al actualizar el Pedido: " + error)
    }
}

// DELETE
async function DeletePedido(id) {
    try {
        const response = await fetch("http://localhost:3000/Pedidos/" + id, {
            method: "DELETE"
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log("Error al eliminar el Pedido: " + error)
    }
}

export default { GetPedidos, PostPedidos, PatchPedido, DeletePedido }
