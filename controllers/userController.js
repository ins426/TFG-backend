const User = require("../models/UserSchema")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: process.env.CONTACT_EMAIL,
            pass: process.env.PASSWORD_EMAIL,
         },
    secure: true,
    });

/**
 async function register(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({name: req.body.name, email: req.body.email, password: hashedPassword})
        await newUser.save()

        res.status(201).send()
    } catch {
        res.status(500).send()
    }
} **/

async function addUser(req, res) {
    //Checks if user is an administrator
    if(req.user.rol !== 'administrador'){
        return res.status(403).send("No tienes suficientes permisos")
    }

    const newUser = new User({...req.body});
    await newUser.save(function (err){
        if(err){
            if(err.code === 11000){
                //Duplicate user email
                return res.status(422).send({
                    message:'El correo electrónico ya está asociado a una cuenta',
                    email:req.body['email']})
            }
            //Other errors
            return res.status(422).send(err);
        }
        const mailData = {
            from: process.env.CONTACT_EMAIL,  // sender address
            to: req.body['email'],   // receiver
            subject: 'DayDay - Activación de cuenta',
            text: 'That was easy!',
            html: '<b>Hola! </b>',
        }
        transporter.sendMail(mailData, function (err, info) {
           if(err)
             return res.status(422).send(err);
           else
               return res.status(201).json(req.body);
        })
    });
}

async function getPsychologists(req, res) {
    let psychologists = await User.find({'rol': 'psicologo'}).exec()
    return res.status(201).json(psychologists);
}


module.exports = {addUser, getPsychologists}