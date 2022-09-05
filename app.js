const express = require("express")
const app = express()
const router = require("./routes/routes");
const mongoose = require('mongoose')

app.use(express.json())
app.use("/",router)

mongoose.connect("mongodb://localhost/dd_db")

app.listen(process.env.PORT)
