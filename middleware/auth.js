require('dotenv').config()

const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user) =>{
        if(err)return res.sendStatus(403)
        req.user = user
        next()
    })
}

async function login(req, res) {
    const user = await User.findOne({'email': req.body.email})
    if (!user) return res.status(400).send('Cannot find user')
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({'email': user.email}, process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1800s'})
            const refreshToken = jwt.sign({'email': user.email}, process.env.REFRESH_TOKEN_SECRET)

            return res.json({accessToken: accessToken, refreshToken: refreshToken})
        } else {
            res.send('Not allowed')
        }
    } catch {
        res.status(500).send()
    }
}

function logout(req, res) {
    /**refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)**/
}

function token (req,res){
    const refreshToken = req.body.token
    if(!refreshToken) return res.sendStatus(401)

    if(!refreshTokens.includes(refreshToken)) return 403
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        const accessToken = jwt.sign({'email': user.email}, process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1800s'})
        res.json({accessToken: accessToken})
    })
}

module.exports = {login, token, logout, authenticateToken}