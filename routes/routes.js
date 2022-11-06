const express = require('express')
const {login, authenticateToken, checkToken} = require("../controllers/authController")
const {addUser,getPsychologists,  register, getPatitents, setPassword,
getPatientPsychologist, editPatient, deleteUser, editPsychologist, changePassword, forgetPassword
} = require("../controllers/userController")
const {getAppointments, addAppointment, editAppointment,
deleteAppointment, getAvailableStartAppointments, getAvailableEndAppointments} = require("../controllers/appointmentController")

const router = express.Router()

//Auth endpoints
router.post("/api/login", login)
router.post("/api/check-token", checkToken)

//User endpoints
router.post("/api/user",authenticateToken, addUser)
router.put("/api/patient",authenticateToken, editPatient)
router.put("/api/psychologist",authenticateToken, editPsychologist)
router.delete("/api/user/:id",authenticateToken,deleteUser)
router.put("/api/change-password",authenticateToken,changePassword)
router.get("/api/psychologists", authenticateToken, getPsychologists)
router.get("/api/patients", authenticateToken, getPatitents)
router.post("/api/patient-psychologist", authenticateToken, getPatientPsychologist)
router.post("/api/activate-account", setPassword)
router.put("/api/forget-password",forgetPassword)


// Appointment endpoints
router.get("/api/appointment", authenticateToken, getAppointments)
router.post("/api/available-start-appointment", authenticateToken, getAvailableStartAppointments)
router.post("/api/available-end-appointment", authenticateToken, getAvailableEndAppointments)
router.post("/api/appointment", authenticateToken,addAppointment)
router.put("/api/appointment/:id", authenticateToken, editAppointment)
router.delete("/api/appointment/:id", authenticateToken, deleteAppointment)

module.exports = router