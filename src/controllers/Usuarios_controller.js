import sendMailToUser from "../config/nodemailer.js"
import Usuario from "../models/Usuarios.js"

const registro = async (req, res) => {
    //Paso1 - Tomar los datos
    const{email, password} = req.body

    //Paso2 - Validar datos
    if(Object.values(req.body).includes(""))return res.status(400).json({msg:"Lo sentimos debes llenar todos los campos"})

    const verificarEmailBDD = await Usuario.findOne ({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos el email ya se encuentra registrado"})

    //Paso 3 - Interactuar con la BDD
    const  nuevoUser =  new Usuario(req.body)
    nuevoUser.password = await nuevoUser.encrypPassword(password)
    const token = nuevoUser.crearToken()
    await sendMailToUser(email,token)
    await nuevoUser.save()
    res.status(200).json({msg:"Revisa tu correo para verificar tu cuenta"})
}


const confirmEmail = async (req,res) => {

    //Paso1
    const {token} = req.params
    //Paso2
    if (!(token)) return res.status(400).json({msg:"Lo sentimos no s epuede validar tu cuenta"})

    const UserBDD = await Usuario.findOne({token})
    if(!UserBDD?.token)return res.status(400).json({msg:"La cuenta ya ha sido confirmada"})

    //Paso3
    UserBDD.token = null
    UserBDD.confirmEmail = true
    await UserBDD.save()

    res.status(200).json({msg:"Token verificado ya puedes iniciar sesion"})
}


//Login

const login = async (req,res) =>{

        //Paso1 - Tomar los datos
        const{email, password} = req.body

        //Paso2 - Validar datos
        if(Object.values(req.body).includes(""))return res.status(400).json({msg:"Lo sentimos debes llenar todos los campos"})
    
        const UserBDD = await Usuario.findOne ({email})
        if(UserBDD?.confirmEmail===false)
            return res.status(400).json({msg:"Lo sentimos debes validar tu cuenta"})

        if(!UserBDD) return res.status(400).json({msg:"Lo sentimos el email no se encuentra registrado"})
        
        const verificarPassword = await UserBDD.matchPassword(password)
        if(!verificarPassword)
            return res.status(400).json({msg:"Lo sentimos el password no es correcto"})
    
        //Paso 3 - Interactuar con la BDD
        res.status(200).json(UserBDD)

}




export {
    registro,
    confirmEmail,
    login
}
