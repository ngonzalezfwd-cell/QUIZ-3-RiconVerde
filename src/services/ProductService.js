//GET

async function GetProductos() {

    try {

        const response = await fetch("http://localhost:3000/Productos")
        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al obtener los Productos" + error);
        
        
    }
    
}

//POST

async function PostProductos(producto) {

    try {

        const response = await fetch("http://localhost:3000/Productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al crear el Producto" + error);
        
        
    }
    
}

//PATCH

async function PatchProductos(id, producto) {

    try {

        const response = await fetch("http://localhost:3000/Productos/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al actualizar el Producto" + error);
        
        
    }
    
}

//DELETE

async function DeleteProductos(id) {

    try {

        const response = await fetch("http://localhost:3000/Productos/" + id, {
            method: "DELETE"
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al eliminar el Producto" + error);
        
        
    }
    
}

export default {GetProductos, PostProductos, PatchProductos, DeleteProductos}
