const express = require("express")
const cors = require("cors")
const router = require("./routes/routes");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const https = require('https')
const compression = require('compression')

const app = express()

app.use(express.json())
app.use("/",router)
app.use(cookieParser())
app.use(cors())
app.use(express.static(`${__dirname}/dist`))
app.use(compression())

mongoose.connect("mongodb+srv://ines:"+process.env.MONGODB_ATLAS_PASSWORD+
    "@cluster0.wnqkcmp.mongodb.net/dd_db?retryWrites=true&w=majority")

//mongoose.connect("mongodb:// localhost/dd_db")

/**
https.createServer({
    cert: fs.readFileSync("localhost.crt"),
    key: fs.readFileSync("localhost.key")
},app).listen(27017)**/

app.listen(8080)
