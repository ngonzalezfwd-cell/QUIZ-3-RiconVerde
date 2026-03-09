import React from "react"
import Routing from "./router/Routing"
import { CarritoProvider } from "./context/CarritoContext"

function App() {
  return (
    <CarritoProvider>
      <Routing />
    </CarritoProvider>
  )
}

export default App
