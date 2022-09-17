const express = require("express")
const app = express()
const cors = require("cors")
const router = require("./routes/routes");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use("/",router)
app.use(cors())
app.use(cookieParser())

mongoose.connect("mongodb://localhost/dd_db")

app.listen(process.env.PORT)
