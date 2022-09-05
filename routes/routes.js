const express = require('express')
const {login} = require("../middleware/auth")
const {register} = require("../controllers/userController")

const router = express.Router()

router.post("/login", login)
router.post("/register",register)

module.exports = router