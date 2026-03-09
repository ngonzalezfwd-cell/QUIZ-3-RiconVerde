//GET

async function GetUsuarios() {

    try {

        const response = await fetch("http://localhost:3000/Usuarios")
        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al obtener los Usuarios" + error);
        
        
    }
    
}

//POST

async function PostUsuarios(usuario) {

    try {

        const response = await fetch("http://localhost:3000/Usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al crear el Usuario" + error);
        
        
    }
    
}

//PATCH

async function PatchUsuarios(id, usuario) {

    try {

        const response = await fetch("http://localhost:3000/Usuarios/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al actualizar el Usuario" + error);
        
        
    }
    
}

//DELETE

async function DeleteUsuarios(id) {

    try {

        const response = await fetch("http://localhost:3000/Usuarios/" + id, {
            method: "DELETE"
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al eliminar el Usuario" + error);
        
        
    }
    
}

export default {GetUsuarios, PostUsuarios, PatchUsuarios, DeleteUsuarios}

