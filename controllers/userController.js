const User = require("../models/UserSchema")
const bcrypt = require('bcrypt')

async function register(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({name: req.body.name, email: req.body.email, password: hashedPassword})
        await newUser.save()

        res.status(201).send()
    } catch {
        res.status(500).send()
    }
}

function hola(req,res){
    console.log(req.headers.cookie.split(';'))
    res.json({saludo:"hola"})
}

module.exports = {register, hola}