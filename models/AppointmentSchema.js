const mongoose = require('mongoose')

/**
 * Appointment Schema
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {EndTimezone: {default: null, type: DateConstructor}, EndTime: StringConstructor, id_psychologist: ObjectId, StartTime: StringConstructor, StartTimezone: {default: null, type: DateConstructor}, _id: ObjectId, Observations: StringConstructor, Subject: StringConstructor, id_patient: ObjectId}>}
 */
const appointmentSchema = new mongoose.Schema({
    Subject:
        {type: String,
        required: true}, //Patients name
    StartTime:
        {type: Date,
        required: true},
    EndTime:
        {type: Date,
        required: true},
    StartTimezone:{ type: Date, default: null},
    EndTimezone:{ type: Date, default: null},
    Observations: String,
    id_psychologist:
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
    id_patient:
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
    CategoryColor: String,
    IsBlock: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("appointments", appointmentSchema)