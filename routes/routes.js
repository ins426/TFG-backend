const express = require('express')
const {login, authenticateToken} = require("../controllers/authController")
const {addUser,getPsychologists,  register} = require("../controllers/userController")
const {getAppointments, addAppointment, editAppointment,
deleteAppointment, getAvailableStartAppointments, getAvailableEndAppointments} = require("../controllers/appointmentController")

const router = express.Router()

router.post("/api/login", login)

//User endpoints
router.post("/api/user", addUser)
//router.post("/api/register",register)
router.get("/api/psychologists", authenticateToken, getPsychologists)

// Appointment endpoints
router.get("/api/appointment", authenticateToken, getAppointments)
router.post("/api/available-start-appointment", authenticateToken, getAvailableStartAppointments)
router.post("/api/available-end-appointment", authenticateToken, getAvailableEndAppointments)
router.post("/api/appointment", authenticateToken,addAppointment)
router.put("/api/appointment/:id", authenticateToken, editAppointment)
router.delete("/api/appointment/:id", authenticateToken, deleteAppointment)

module.exports = router