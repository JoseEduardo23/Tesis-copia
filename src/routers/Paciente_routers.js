import {Router} from 'express'
import { actualizarPaciente, detallePaciente, eliminarPaciente, listarPaciente, loginPaciente, perfilPaciente, registroPaciente } from '../controllers/Paciente_controller.js'
import { verificarAutenticacion } from '../helpers/crearJWT.js'

const router = Router()

//Mascotas
router.post('/paciente/registro',verificarAutenticacion, registroPaciente)

router.get('/paciente',verificarAutenticacion,listarPaciente)

router.get('/paciente/:id',verificarAutenticacion, detallePaciente)

router.put('/paciente/:id',verificarAutenticacion, actualizarPaciente)

router.delete('/paciente/:id',verificarAutenticacion, eliminarPaciente)

//Dueños
router.post('/paciente/login', loginPaciente)

router.get('/paciente-perfil',verificarAutenticacion, perfilPaciente)

export default router