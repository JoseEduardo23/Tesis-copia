//Paaso 1 Modelos para administradores.
import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const usersSchema = new Schema({
    nombre:{
        type: String,
        require: true,
        trim: true
    },
    apellido:{
        type: String,
        require: true,
        trim: true
    },
    direccion:{
        type: String,
        trim: true,
        default: null //Cuando se haga una insercion en la base de datos y no se inserte se va por default el valor null
    },
    telefono:{
        type: Number,
        trim: true,
        default: null
    },
    email:{
        type: String,
        require: true,
        trim: true,
        unique: true //Debe ser unico
    },
    token:{
        type: String,
        default: null
    },
    password:{
        type: String,
        require: true
    },
    status:{
        type: Boolean,
        default: true
    },
    confirmEmail:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

//Métodos que podemos ejecutar
//Cifrar el password del admin
usersSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(password,salt)
    return passwordEncrypt;
}

// Verificar el password
usersSchema.methods.matchPassword = async function(password) {
    const response = await bcrypt.compare(password, this.password); 
    return response;
}

//Crear el token
usersSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

//Modelo
export default model('Usuario', usersSchema)
