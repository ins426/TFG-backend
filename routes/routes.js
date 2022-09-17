const express = require('express')
const {login} = require("../controllers/authController")
const {register} = require("../controllers/userController")

const router = express.Router()

router.post("/api/login", login)

module.exports = router