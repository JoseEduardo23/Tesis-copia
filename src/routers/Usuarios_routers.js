import {Router} from 'express'
import { confirmEmail, login, recuperarPassword, registro,conprobarTokenPassword, nuevoPassword, perfilUsuario } from '../controllers/Usuarios_controller.js'
import { verificarAutenticacion } from '../helpers/crearJWT.js'

const router = Router()

router.post('/register', registro)
router.get('/confirmar/:token', confirmEmail )
router.post('/login', login)
router.post('/recuperar-password', recuperarPassword)
router.get('/recuperar-password/:token',conprobarTokenPassword)
router.post('/nuevo-password/:token', nuevoPassword)

router.get('/perfiluser',verificarAutenticacion,perfilUsuario)

export default router