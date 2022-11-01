const mongoose = require('mongoose')

/**
 * User schema
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {password: StringConstructor, surname: StringConstructor, name: StringConstructor, _id: ObjectId, email: StringConstructor, rol: {type: StringConstructor, enum: string[]}, id_patients: [{type: ObjectId}]}>}
 */
const userSchema = new mongoose.Schema({
    name: {
       type:String,
       required: true
    },
    surname: {
       type:String,
       required: true
    },
    email:{
       type:String,
       required: true,
        unique:true
    },
    password: {
        type:String,
        required: false
    },
    rol: {
        type: String,
        enum: ["administrador", "psicologo", "paciente"],
        required: true
    },
    id_patients: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }],

    CategoryColor:{
        type:String,
        required:false
    }
})

module.exports = mongoose.model("users", userSchema)