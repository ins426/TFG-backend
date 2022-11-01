const User = require("../models/UserSchema")
const Appointment = require("../models/AppointmentSchema")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: process.env.CONTACT_EMAIL,
            pass: process.env.PASSWORD_EMAIL,
         },
    secure: true,
    });


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

async function addUser(req, res) {
    //Checks if user is an administrator with cookies
    if(req.user.rol == 'administrador'){
        const idPsychologist =  req.body['idPsychologist']
        delete req.body['idPsychologist'];
        const colorCategory =  req.body['ColorCategory']
        delete req.body['ColorCategory'];

       const newUser = new User({...req.body});
        await newUser.save(async function (err) {
            if (err) {
                if (err.code === 11000) {
                    //Duplicate user email
                    return res.status(422).send({
                        message: 'El correo electrónico ya está asociado a una cuenta',
                        email: req.body['email']
                    })
                }
                //Other errors
                return res.status(422).send(err);
            }

            if(idPsychologist){
                await User.update(
                {_id: idPsychologist},
                {$push: {id_patients:newUser._id}}
                ).exec()
            }

            if(colorCategory){
                await User.update(
                {_id: newUser._id},
                {$set: {ColorCategory:colorCategory}}
                ).exec()
            }

            const token = jwt.sign({'email': req.body['email']}, process.env.AUTH_TOKEN_SECRET,
                {expiresIn: '86400s'})

            const mailData = {
                from: process.env.CONTACT_EMAIL,  // sender address
                to: req.body['email'],   // receiver
                subject: 'DayDay - Activación de cuenta',
                attachments: [{
                    filename: 'DayDay_log_shadow.png',
                    path: '/home/ins/Universidad/TFG/DayDay/TFG-backend/assets/img/DayDay_log_shadow.png',
                    cid: 'logo' //my mistake was putting "cid:logo@cid" here!
                }],
                html: '<html>\n' +
                    '<head>\n' +
                    '\n' +
                    '  <meta charset="utf-8">\n' +
                    '  <meta http-equiv="x-ua-compatible" content="ie=edge">\n' +
                    '  <title>Activación de cuenta</title>\n' +
                    '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
                    '  <style type="text/css">\n' +
                    '  /**\n' +
                    '   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.\n' +
                    '   */\n' +
                    '  @media screen {\n' +
                    '    @font-face {\n' +
                    '      font-family: \'Source Sans Pro\';\n' +
                    '      font-style: normal;\n' +
                    '      font-weight: 400;\n' +
                    '      src: local(\'Source Sans Pro Regular\'), local(\'SourceSansPro-Regular\'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format(\'woff\');\n' +
                    '    }\n' +
                    '\n' +
                    '    @font-face {\n' +
                    '      font-family: \'Source Sans Pro\';\n' +
                    '      font-style: normal;\n' +
                    '      font-weight: 700;\n' +
                    '      src: local(\'Source Sans Pro Bold\'), local(\'SourceSansPro-Bold\'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format(\'woff\');\n' +
                    '    }\n' +
                    '  }\n' +
                    '\n' +
                    '  /**\n' +
                    '   * Avoid browser level font resizing.\n' +
                    '   * 1. Windows Mobile\n' +
                    '   * 2. iOS / OSX\n' +
                    '   */\n' +
                    '  body,\n' +
                    '  table,\n' +
                    '  td,\n' +
                    '  a {\n' +
                    '    -ms-text-size-adjust: 100%; /* 1 */\n' +
                    '    -webkit-text-size-adjust: 100%; /* 2 */\n' +
                    '  }\n' +
                    '\n' +
                    '  /**\n' +
                    '   * Remove extra space added to tables and cells in Outlook.\n' +
                    '   */\n' +
                    '  table,\n' +
                    '  td {\n' +
                    '    mso-table-rspace: 0pt;\n' +
                    '    mso-table-lspace: 0pt;\n' +
                    '  }\n' +
                    '\n' +
                    '  /**\n' +
                    '   * Better fluid images in Internet Explorer.\n' +
                    '   */\n' +
                    '  img {\n' +
                    '    -ms-interpolation-mode: bicubic;\n' +
                    '  }\n' +
                    '\n' +
                    '  /**\n' +
                    '   * Remove blue links for iOS devices.\n' +
                    '   */\n' +
                    '  a[x-apple-data-detectors] {\n' +
                    '    font-family: inherit !important;\n' +
                    '    font-size: inherit !important;\n' +
                    '    font-weight: inherit !important;\n' +
                    '    line-height: inherit !important;\n' +
                    '    color: inherit !important;\n' +
                    '    text-decoration: none !important;\n' +
                    '  }\n' +
                    '\n' +
                    '  /**\n' +
                    '   * Fix centering issues in Android 4.4.\n' +
                    '   */\n' +
                    '  div[style*="margin: 16px 0;"] {\n' +
                    '    margin: 0 !important;\n' +
                    '  }\n' +
                    '\n' +
                    '  body {\n' +
                    '    width: 100% !important;\n' +
                    '    height: 100% !important;\n' +
                    '    padding: 0 !important;\n' +
                    '    margin: 0 !important;\n' +
                    '  }\n' +
                    '\n' +
                    '  /**\n' +
                    '   * Collapse table borders to avoid space between cells.\n' +
                    '   */\n' +
                    '  table {\n' +
                    '    border-collapse: collapse !important;\n' +
                    '  }\n' +
                    '\n' +
                    '  a {\n' +
                    '    color: #1a82e2;\n' +
                    '  }\n' +
                    '\n' +
                    '  img {\n' +
                    '    height: auto;\n' +
                    '    line-height: 100%;\n' +
                    '    text-decoration: none;\n' +
                    '    border: 0;\n' +
                    '    outline: none;\n' +
                    '  }\n' +
                    '  </style>\n' +
                    '\n' +
                    '</head>\n' +
                    '<body style="background-color: #e9ecef;">\n' +
                    '\n' +
                    '  <!-- start preheader -->\n' +
                    '  <!-- end preheader -->\n' +
                    '\n' +
                    '  <!-- start body -->\n' +
                    '  <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
                    '\n' +
                    '    <!-- start logo -->\n' +
                    '    <tr>\n' +
                    '      <td align="center" bgcolor="#e9ecef">\n' +
                    '        <!--[if (gte mso 9)|(IE)]>\n' +
                    '        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n' +
                    '        <tr>\n' +
                    '        <td align="center" valign="top" width="600">\n' +
                    '        <![endif]-->\n' +
                    '        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
                    '          <tr>\n' +
                    '            <td align="center" valign="top" style="padding: 36px 24px;">\n' +
                    '              <a target="_blank" style="display: inline-block;">\n' +
                    '                <img src="cid:logo" border="0" width="48" style="display: block; width: 150px; max-width: 150px; min-width: 150px;">\n' +
                    '              </a>\n' +
                    '            </td>\n' +
                    '          </tr>\n' +
                    '        </table>\n' +
                    '        <!--[if (gte mso 9)|(IE)]>\n' +
                    '        </td>\n' +
                    '        </tr>\n' +
                    '        </table>\n' +
                    '        <![endif]-->\n' +
                    '      </td>\n' +
                    '    </tr>\n' +
                    '    <!-- end logo -->\n' +
                    '\n' +
                    '    <!-- start hero -->\n' +
                    '    <tr>\n' +
                    '      <td align="center" bgcolor="#e9ecef">\n' +
                    '        <!--[if (gte mso 9)|(IE)]>\n' +
                    '        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n' +
                    '        <tr>\n' +
                    '        <td align="center" valign="top" width="600">\n' +
                    '        <![endif]-->\n' +
                    '        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
                    '          <tr>\n' +
                    '            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: \'Source Sans Pro\', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">\n' +
                    '              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Activa tu cuenta</h1>\n' +
                    '            </td>\n' +
                    '          </tr>\n' +
                    '        </table>\n' +
                    '        <!--[if (gte mso 9)|(IE)]>\n' +
                    '        </td>\n' +
                    '        </tr>\n' +
                    '        </table>\n' +
                    '        <![endif]-->\n' +
                    '      </td>\n' +
                    '    </tr>\n' +
                    '    <!-- end hero -->\n' +
                    '\n' +
                    '    <!-- start copy block -->\n' +
                    '    <tr>\n' +
                    '      <td align="center" bgcolor="#e9ecef">\n' +
                    '        <!--[if (gte mso 9)|(IE)]>\n' +
                    '        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n' +
                    '        <tr>\n' +
                    '        <td align="center" valign="top" width="600">\n' +
                    '        <![endif]-->\n' +
                    '        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
                    '\n' +
                    '          <!-- start copy -->\n' +
                    '          <tr>\n' +
                    '            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: \'Source Sans Pro\', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">\n' +
                    '              <p style="margin: 0;">Haz click sobre el boton de abajo para activar tu cuenta. Si este correo electrónico no iba dirigido a ti, puedes borrar de forma segura este email.</p>\n' +
                    '            </td>\n' +
                    '          </tr>\n' +
                    '          <!-- end copy -->\n' +
                    '\n' +
                    '          <!-- start button -->\n' +
                    '          <tr>\n' +
                    '            <td align="left" bgcolor="#ffffff">\n' +
                    '              <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
                    '                <tr>\n' +
                    '                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">\n' +
                    '                    <table border="0" cellpadding="0" cellspacing="0">\n' +
                    '                      <tr>\n' +
                    '                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">\n' +
                    '                          <a href="https://localhost:4200/activar-cuenta?token=' + token + '" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: \'Source Sans Pro\', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; background-color: #009FB7; text-decoration: none; border-radius: 6px;">Activar cuenta</a>\n' +
                    '                        </td>\n' +
                    '                      </tr>\n' +
                    '                    </table>\n' +
                    '                  </td>\n' +
                    '                </tr>\n' +
                    '              </table>\n' +
                    '            </td>\n' +
                    '          </tr>\n' +
                    '          <!-- end button -->\n' +
                    '\n' +
                    '          <!-- start copy -->\n' +
                    '          <tr>\n' +
                    '            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: \'Source Sans Pro\', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">\n' +
                    '              <p style="margin: 0;">También puedes utilizar el siguiente enlace para activar tu cuenta:</p>\n' +
                    '              <a href="https://localhost:4200/activar-cuenta?token=' + token + '" target="_blank">https://localhost:4200/activar-cuenta?token=' + token + '</a>\n' +
                    '            </td>\n' +
                    '          </tr>\n' +
                    '          <!-- end copy -->\n' +
                    '\n' +
                    '          <!-- start copy -->\n' +
                    '          <tr>\n' +
                    '            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: \'Source Sans Pro\', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">\n' +
                    '              <p style="margin: 0;">Saludos,<br> El equipo de DayDay</p>\n' +
                    '            </td>\n' +
                    '          </tr>\n' +
                    '          <!-- end copy -->\n' +
                    '\n' +
                    '        </table>\n' +
                    '        <!--[if (gte mso 9)|(IE)]>\n' +
                    '        </td>\n' +
                    '        </tr>\n' +
                    '        </table>\n' +
                    '        <![endif]-->\n' +
                    '      </td>\n' +
                    '    </tr>\n' +
                    '    <!-- end copy block -->\n' +
                    '\n' +
                    '    <!-- start footer -->\n' +
                    '    <tr>\n' +
                    '      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">\n' +
                    '        <!--[if (gte mso 9)|(IE)]>\n' +
                    '        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n' +
                    '        <tr>\n' +
                    '        <td align="center" valign="top" width="600">\n' +
                    '        <![endif]-->\n' +
                    '        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
                    '\n' +
                    '\n' +
                    '        </table>\n' +
                    '        <!--[if (gte mso 9)|(IE)]>\n' +
                    '        </td>\n' +
                    '        </tr>\n' +
                    '        </table>\n' +
                    '        <![endif]-->\n' +
                    '      </td>\n' +
                    '    </tr>\n' +
                    '    <!-- end footer -->\n' +
                    '\n' +
                    '  </table>\n' +
                    '  <!-- end body -->\n' +
                    '\n' +
                    '</body>\n' +
                    '</html>',
            }
            transporter.sendMail(mailData, function (err, info) {
                if (err)
                    return res.status(422).send(err);
                else
                    return res.status(201).json(req.body);
            })
        });
    }else{
        return res.status(401).send()
    }
}

async function getPsychologists(req, res) {
    let psychologists
    if(req.user.rol == 'administrador'){
        psychologists = await User.find({'rol': 'psicologo'}).exec()
    }else if(req.user.rol == 'psicologo'){
        psychologists = [req.user]
    }else{
        //User is a patient
        psychologists = [await User.findOne({ id_patients:{ "$in" : [req.user._id]}}).exec()]
    }

    return res.status(201).json(psychologists);
}

async function getPatitents(req, res) {
     let patients = []
     if(req.user.rol == 'administrador'){
         patients = await User.find({'rol': 'paciente'}).exec()
     }else if(req.user.rol == 'psicologo'){
         let id_patients = req.user.id_patients

         for(let i = 0; i < id_patients.length; ++i){
             patients = patients.concat(await User.find({'_id': id_patients[i]}).exec())
         }
     }else{
         //User is a patient
         patients.push(req.user)
     }
    return res.status(201).json(patients);
}

async function setPassword(req, res) {
     token = req.body['token']
     jwt.verify(token, process.env.AUTH_TOKEN_SECRET,async (err, user) => {
        if (err) return res.sendStatus(401)
        email = req.body['email']
        password = req.body['password']
         const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.find().exec()
         console.log(req.body)
        await User.updateOne({'email': email},
         {$set:{password:hashedPassword}},
        ).exec()
        return res.status(201)
    })
}

async function getPatientPsychologist(req,res){
    psychologist = await User.findOne({ id_patients:{ "$in" : [req.body['patientId']]}}).exec()
    return res.status(201).json(psychologist);
}

async function editPatient(req,res){

     if(req.user.rol == 'administrador'){
           idPatient = req.body['idPatient']
        oldIdPsychologist = req.body['oldIdPsychologist']
        newIdPsychologist = req.body['newIdPsychologist']
        surname = req.body['surname']
        name = req.body['name']
        subject = name + " "+ surname

        await User.updateOne({ _id:oldIdPsychologist }, {
            $pullAll: {
                id_patients: [idPatient]
            }}).exec();

         await User.update(
             {_id: newIdPsychologist},
             {$push: {id_patients:idPatient}}
         ).exec()

        await User.updateOne({_id: idPatient},
             {$set:{surname:surname}},
        ).exec()

        await User.updateOne({_id: idPatient},
             {$set:{name:name}},
        ).exec()

        await Appointment.update({id_patient:idPatient},
            {$set:{id_psychologist:newIdPsychologist}})

        await Appointment.update({id_patient:idPatient},
            {$set:{Subject:subject}})

        return res.status(201).send()
     }else{
         res.sendStatus(401)
     }

}

async function deleteUser(req,res) {

     if(req.user.rol == 'administrador'){
         idUser = req.params.id

        await User.deleteOne({_id: idUser})
        await Appointment.deleteMany({id_patient: idUser})

        return res.status(201).send()
     }else{
         res.sendStatus(401)
     }
}

async function editPsychologist(req, res) {
     if(req.user.rol == 'administrador'){
        idPsychologist = req.body['idPsychologist']
         surname = req.body['surname']
        name = req.body['name']
         colorCategory = req.body['ColorCategory']

         if(req.body['ColorCategory']['hex'] != undefined){
             colorCategory ='#'+ req.body['ColorCategory']['hex']
         }

         await User.updateOne({_id: idPsychologist},
             {$set:{surname:surname}},
        ).exec()

        await User.updateOne({_id: idPsychologist},
             {$set:{name:name}},
        ).exec()


        await User.updateOne({_id: idPsychologist},
             {$set:{CategoryColor:colorCategory}},
        ).exec()

         await Appointment.update({id_psychologist: idPsychologist},
             {$set:{CategoryColor:colorCategory}},
        ).exec()

        return res.status(201).send()
     }else{
         res.sendStatus(401)
     }
}



module.exports = {setPassword, addUser, getPsychologists, register,getPatitents,getPatientPsychologist, editPatient,
deleteUser,  editPsychologist}