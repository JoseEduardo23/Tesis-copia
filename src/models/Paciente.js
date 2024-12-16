import { Schema, model } from "mongoose";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

//Schema
const pacienteSchema = new Schema({
    nombre:{
        type:String,
        require: true,
        trim: true
    },
    propietario:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    celular:{
        type:String,
        require:true,
        trim:true
    },
    convencional:{
        type:String,
        require:true,
        trim:true
    },
    ingreso:{
        type:Date,
        require:true,
        trim:true,
        default:Date.now()
    },
    sintomas:{
        type:String,
        require:true,
        trim:true
    },
    salida:{
        type:Date,
        require:true,
        trim:true,
        default:Date.now()
    },
    estado:{
        type:Boolean,
        default:true
    },
    usuario:{
        type:mongoose.Schema.Types.ObjectId, //Claves primarias
        ref:'Usuario' //FK foreign key
    }
})

//metodos

pacienteSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(password,salt)
    return passwordEncrypt;
}

// Verificar el password
pacienteSchema.methods.matchPassword = async function(password) {
    const response = await bcrypt.compare(password, this.password); 
    return response;
}


export default model ('Paciente', pacienteSchema)