//GET

async function GetPlantas() {

    try {

        const response = await fetch("http://localhost:3000/Plantas")
        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al obtener las Plantas" + error);
        
        
    }
    
}

//POST

async function PostPlantas(planta) {

    try {

        const response = await fetch("http://localhost:3000/Plantas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(planta)
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al crear la Planta" + error);
        
        
    }
    
}

//PATCH

async function PatchPlantas(id, planta) {

    try {

        const response = await fetch("http://localhost:3000/Plantas/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(planta)
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al actualizar la Planta" + error);
        
        
    }
    
}

//DELETE

async function DeletePlantas(id) {

    try {

        const response = await fetch("http://localhost:3000/Plantas/" + id, {
            method: "DELETE"
        })

        const data = await response.json()
        return data

    } catch (error) {

        console.log("Error al eliminar la Planta" + error);
        
        
    }
    
}

export default {GetPlantas, PostPlantas, PatchPlantas, DeletePlantas}
