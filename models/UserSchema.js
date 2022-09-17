const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email:String,
    password: String,
})

module.exports = mongoose.model("User", userSchema)