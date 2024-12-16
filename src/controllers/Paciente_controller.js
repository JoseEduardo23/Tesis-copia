import { sendMailToPaciente } from "../config/nodemailer.js"
import Paciente from "../models/Paciente.js"

//Mascotas
const registroPaciente = async (req, res) => {
  
    const {email} = req.body

    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
    
    const verificarEmailBDD = await Paciente.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"El email ya se encuentra registrado"})
  
    const nuevoPaciente = new Paciente(req.body)

    const passworEncrypt = Math.random().toString(36).slice(2)
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("use"+passworEncrypt)
    await sendMailToPaciente(email,"use"+passworEncrypt)
    nuevoPaciente.usuario=req.UserBDD._id

    await nuevoPaciente.save()
    res.status(200).json({msg:"Registro exitoso del paciente y correo enviado al dueño"})
}


const listarPaciente = async (req, res) => {
    const pacientes = await Paciente.find({estado:true}).populate('usuario','_id nombre apellido email').select("-estado -__v").where('usuario').equals(req.UserBDD) //Lista los pacientes activos.
    res.status(200).json(pacientes)
}

const detallePaciente = (req, res) => {
    res.send("Detalle paciente")
}
const actualizarPaciente = (req, res) => {
    res.send("Paciente actualizado")
}
const eliminarPaciente = (req, res) => {
    res.send("Paciente eliminado")
}

//Dueños
const loginPaciente = (req, res) => {
    res.send("Inicio de sesion exitoso")
  }

const perfilPaciente = (req, res) => {
    res.send("Puede ver su perfil")
}
  
export{
    registroPaciente,
    listarPaciente,
    detallePaciente,
    actualizarPaciente,
    eliminarPaciente,
    loginPaciente,
    perfilPaciente
}
