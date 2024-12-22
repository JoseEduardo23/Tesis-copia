// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerUser from './routers/Usuarios_routers.js'
import routerMascotas from './routers/Paciente_routers.js'



// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.PORT || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})

//Rutas para veterinarios

app.use('/api/', routerUser)


//Rutas para mascotas

app.use('/api/', routerMascotas)

//Rutas no encontradas

app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


// Exportar la instancia de express por medio de app
export default  app