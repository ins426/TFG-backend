require('dotenv').config()

const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");

function authenticateToken(req, res, next){

    /**
    if(!token) return res.sendStatus(401)

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user) =>{
        if(err)return res.sendStatus(401)
        req.user = user
        next()
    })**/
}

/**
 * Function in order to login in the platform. Firstly, authentication checks if
 * user crendentials are the right ones and secondly checks the JWT for authorization
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function login(req, res) {
    //Authentication
    const user = await User.findOne({'email': req.body.email})

    if (!user) return res.status(400).send('Cannot find user')
    try {

        //Authorization
        if (await bcrypt.compare(req.body.password, user.password)) {
            const authToken = jwt.sign({'email': user.email}, process.env.AUTH_TOKEN_SECRET,
                {expiresIn: '60s'})

            //Setting cookies for JWT tokens, access token and refresh token
            res.cookie("authToken", authToken, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: true
            })

            res.json({email: user.email, 'id':user._id, 'name':user.name}).status(200)
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

module.exports = {login, logout, authenticateToken}