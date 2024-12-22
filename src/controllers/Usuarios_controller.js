import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import { geenrarJWT } from "../helpers/crearJWT.js"
import Usuario from "../models/Usuarios.js"

const registro = async (req, res) => {
    //Paso1 - Tomar los datos
    const { email, password } = req.body

    //Paso2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos debes llenar todos los campos" })

    const verificarEmailBDD = await Usuario.findOne({ email })
    if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos el email ya se encuentra registrado" })

    //Paso 3 - Interactuar con la BDD
    const nuevoUser = new Usuario(req.body)
    nuevoUser.password = await nuevoUser.encrypPassword(password)
    const token = nuevoUser.crearToken()
    await sendMailToUser(email, token)
    await nuevoUser.save()
    res.status(200).json({ msg: "Revisa tu correo para verificar tu cuenta" })
}


const confirmEmail = async (req, res) => {

    //Paso1
    const { token } = req.params
    //Paso2
    if (!(token)) return res.status(400).json({ msg: "Lo sentimos no s epuede validar tu cuenta" })

    const UserBDD = await Usuario.findOne({ token })
    if (!UserBDD?.token) return res.status(400).json({ msg: "La cuenta ya ha sido confirmada" })

    //Paso3
    UserBDD.token = null
    UserBDD.confirmEmail = true
    await UserBDD.save()

    res.status(200).json({ msg: "Token verificado ya puedes iniciar sesion" })
}


//Login

const login = async (req, res) => {

    //Paso1 - Tomar los datos
    const { email, password } = req.body

    //Paso2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos debes llenar todos los campos" })

    const UserBDD = await Usuario.findOne({ email })


    if (UserBDD?.confirmEmail === false)
        return res.status(400).json({ msg: "Lo sentimos debes validar tu cuenta" })

    if (!UserBDD) return res.status(400).json({ msg: "Lo sentimos el email no se encuentra registrado" })

    const verificarPassword = await UserBDD.matchPassword(password)
    if (!verificarPassword)
        return res.status(400).json({ msg: "Lo sentimos el password no es correcto" })

    //Paso 3 - Interactuar con la BDD
    const tokenJWT = geenrarJWT(UserBDD._id, "Usuario")
    res.status(200).json(
        { 
            msg: "Login exitoso",
            user: UserBDD, 
            token: tokenJWT 
        })

}

//Recuperar contraseña

const recuperarPassword = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    const UserBDD = await Usuario.findOne({ email })
    if (!UserBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })
    const token = UserBDD.crearToken()
    UserBDD.token = token
    await sendMailToRecoveryPassword(email, token)
    await UserBDD.save()
    res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
}

const conprobarTokenPassword = async (req, res) => {

    const { token } = req.params

    if ((!token)) return res.status(400).json({ msg: "Lo sentimos no s epuede validar la cuenta" })
    const UserBDD = await Usuario.findOne({ token })
    if (UserBDD?.token !== token) res.status(404).json({ msg: "Lo sentimos no se puede validar la cuenta" })

    await UserBDD.save()
    res.status(200).json({ msg: "Token confirmado, puedes crear tu nueva contraseña" })

}

const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debe llenar todos los cmapos" })

    if (password != confirmpassword) return res.status(404).json({ msg: "Lo sentimos el password no coincide" })

    const UserBDD = await Usuario.findOne({ token: req.params.token })
    if ((UserBDD?.token !== req.params.token)) return res.status(404).json({ msg: "Lo sentimos no se puede validar la cuenta" })

    UserBDD.token = null
    UserBDD.password = await UserBDD.encrypPassword(password)
    await UserBDD.save()
    res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesion con tu nuevo password" })



}

const perfilUsuario = (req, res) => {
    if (req.UserBDD && req.UserBDD.token) {
        delete req.UserBDD.token;
    }
    res.status(200).json({
        msg: "Información del usuario autenticado",
        usuario: req.UserBDD
    });
};


const actualizarpassword = async (req, res) => {
    try {
        const { email, password, newpassword, confirmnewpassword } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Lo sentimos, debe llenar todos los campos." });
        }
        const UserBDD = await Usuario.findOne({ email });
        if (!UserBDD) {
            return res.status(404).json({ msg: "El email proporcionado no está registrado." });
        }
        const isPasswordValid = await UserBDD.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "La contraseña actual no es correcta." });
        }
        if (newpassword !== confirmnewpassword) {
            return res.status(400).json({ msg: "La nueva contraseña no coincide." });
        }
        if (password === newpassword) {
            return res.status(400).json({ msg: "La nueva contraseña no puede ser igual a la contraseña actual." });
        }
        UserBDD.password = await UserBDD.encrypPassword(newpassword);
        await UserBDD.save();

        // Respuesta exitosa
        res.status(200).json({ msg: "Contraseña actualizada correctamente." });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ msg: "Error interno del servidor." });
    }
};

export {
    registro,
    confirmEmail,
    login,
    recuperarPassword,
    conprobarTokenPassword,
    nuevoPassword,
    perfilUsuario,
    actualizarpassword
}
