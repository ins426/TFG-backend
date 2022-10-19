const express = require("express")
const cors = require("cors")
const router = require("./routes/routes");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const https = require('https')

const app = express()

app.use(express.json())
app.use("/",router)
app.use(cookieParser())
app.use(cors())

mongoose.connect("mongodb://localhost/dd_db")


https.createServer({
    cert: fs.readFileSync("localhost.crt"),
    key: fs.readFileSync("localhost.key")
},app).listen(process.env.PORT)

//app.listen(process.env.PORT)
