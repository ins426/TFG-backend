const Appointment = require("../models/AppointmentSchema")
const mongoose = require('mongoose')
const {compare} = require("bcrypt");

/**
 * Get a list of appointments
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getAppointments(req, res) {

    if (req.user.rol === 'administrador') {
        let appointments = await Appointment.find().exec()
        return res.status(201).json(appointments);
    } else if (req.user.rol === 'psicologo') {
        //Sends psychologist's patient's appointments
        let appointments = await Appointment.find({id_psychologist:req.user._id}).exec()
        return res.status(201).json(appointments);
    } else {
        //Sends patient's appointments
        let appointments = await Appointment.find({id_patient:req.user._id}).exec()
    }

/**
    return res.send([{
        Subject: "Cerrado",
        StartTime: "2021-02-15T14:00:00.000Z",
        EndTime: "2021-02-15T17:00:00.000Z",
        IsBlock:true,
         RecurrenceRule: 'FREQ=DAILY;INTERVAL=1'
    },
    ])**/
}

/**
 * Modify appointment's data
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function editAppointment(req, res) {
    try {
        await Appointment.updateMany({_id: new mongoose.Types.ObjectId(req.params.id)},
            {
                Subject: req.body['Subject'],
                id_psychologist: new mongoose.Types.ObjectId(req.body['id_psychologist']),
                id_patient: new mongoose.Types.ObjectId(req.body['id_patient']),
                StartTime: req.body['StartTime'],
                EndTime: req.body['EndTime']
            })
    } catch (err) {
      res.status(422).send(err)
   }

   res.status(200).send(req.body)

}

/**
 * Delete an appointment
 * @param res
 * @param req
 * @returns {Promise<void>}
 */
async function deleteAppointment(res, req) {
    await Appointment.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)});
}

/**
 * Add a new appointment
 * @param req
 * @param res
 */
async function addAppointment(req, res) {
    //Checks if user is an administrator or if it is a psychologist who wants to create
    //a new appointment for one of their patients
    if (req.user.rol !== 'administrador' &&
        !(req.user.rol === 'psicologo' && req.user._id.equals(new mongoose.Types.ObjectId(req.body.id_patient)
                && req.user.id_patients.includes(new mongoose.Types.ObjectId(req.body.id_patient))) &&
        !(req.user.rol === 'paciente' && req.user._id.equals(new mongoose.Types.ObjectId(req.body.id_patient))))) {
        return res.status(403).send("No tienes suficientes permisos")
    }

    const newAppointment = new Appointment({...req.body})
    await newAppointment.save(function (err){
        if(err){
            return res.status(422).send(err)
        }
        return res.status(201).json(req.body);
    })
}

/**
 * Gets psychologist's available start appointment hours for a certain day
 * @param req contains a day and a psychologist
 * @param res
 * @returns {Promise<void>}
 */
async function getAvailableStartAppointments(req,res){
    let startTime = new Date(req.body['day'])
    startTime.setHours(10,0,0,0)
    let endTime = new Date(req.body['day'])
    endTime.setHours(20,0,0,0)

    //Get psychologist's appointments from a certain date
    let appointmentDay = new Date(req.body['day'])
    let appointmentNextDay = new Date(req.body['day']).setHours(appointmentDay.getHours()+24)

    let idPsychologist = req.body['id_psychologist']


    let unableAppointments
    if(idPsychologist){
        unableAppointments = await Appointment.find({StartTime: {$gte: appointmentDay, $lte:appointmentNextDay},
        id_psychologist:idPsychologist}).exec()
    }else{
        unableAppointments = await Appointment.find({StartTime: {$gte: appointmentDay, $lte:appointmentNextDay}}).exec()
    }


    let availableStartHours = []
    //Get available hours
    for(let time = startTime; time <= endTime; time.setMinutes(time.getMinutes()+5)){
        let availableTime = true

        //Calculate availableStarts
        let nextHour = new Date(time)
        nextHour.setHours(nextHour.getHours()+1)

        for(let i = 0; i < unableAppointments.length; ++i){

            //First checks if the time is in the interval of an appointment.
            //Then checks if the time is impossible to achieve the minimum of an hour
            //And don't pass close time
            if((time >= unableAppointments[i].StartTime && time < unableAppointments[i].EndTime) ||
            !(nextHour <= unableAppointments[i].StartTime || nextHour >= unableAppointments[i].EndTime)){
                availableTime = false
                break;
            }
        }

        if(!(nextHour <= endTime)){
            availableTime = false
        }

        if(availableTime){
            let availableAppointment = new Date(time)
            availableStartHours.push(availableAppointment)
        }
    }

    return res.status(201).json(availableStartHours)
}

/**
 * Gets psychologist's available start appointment hours for a certain day
 * @param req contains a day and a psychologist
 * @param res
 * @returns {Promise<void>}
 */
async function getAvailableEndAppointments(req,res){
    let endTime = new Date(req.body['day'])
    endTime.setHours(20,0,0,0)

    let chosenStart = new Date(req.body["chosen_start"])

    let existAppointment = await Appointment.find({StartTime: chosenStart}).exec()
    let availableExistEndAppointment = []

    if(existAppointment.length != 0){
        availableExistEndAppointment = existAppointment
    }

    let nextHourChosenStart = new Date(chosenStart)
    nextHourChosenStart.setHours(nextHourChosenStart.getHours()+1)

    let availableEndAppointment = []

    //Get psychologist's appointments from a certain date
    let appointmentDay = new Date(req.body['day'])
    let appointmentNextDay = new Date(req.body['day']).setHours(appointmentDay.getHours()+24)

    let idPsychologist = req.body['id_psychologist']

    //Get unable appointments of the day
    let unableAppointments
    if(idPsychologist){
        unableAppointments = await Appointment.find({StartTime: {$gte: appointmentDay, $lte:appointmentNextDay},
        id_psychologist:idPsychologist}).exec()
    }else{
        unableAppointments = await Appointment.find({StartTime: {$gte: appointmentDay, $lte:appointmentNextDay}}).exec()
    }

    //If endTime is going to be modified it must be included in available end hours
    let chosenEnd = new Date(req.body['endTime'])

    let availableEndHour = true
    let can = true
    for(let time = nextHourChosenStart; time < endTime; time.setMinutes(time.getMinutes()+5) ){
        availableEndHour = true
        for(let i = 0; i < unableAppointments.length; ++i){
            if(!(time <= unableAppointments[i].StartTime ||
                !( time >= unableAppointments[i].StartTime && time <= unableAppointments[i].EndTime)) &&
                ((chosenEnd && (chosenEnd.getTime() !== unableAppointments[i].EndTime.getTime())))){
                    can = false
                    break;
            }
        }

        if(can){
            let availableAppointment = new Date(time)
            availableEndAppointment.push(availableAppointment)
        }else{
            break;
        }
    }
    return res.status(201).json(availableEndAppointment)
}



module.exports = {getAppointments, addAppointment, editAppointment, deleteAppointment, getAvailableStartAppointments,
getAvailableEndAppointments}