require('dotenv').config()

const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");

/**
 * Validation of auth token cookie
 * @param req
 * @param res
 * @param next
 */
function authenticateToken(req, res, next){
    const authHeader = req.headers['cookie']
    const token = authHeader && authHeader.split('; ').find((row) => row.startsWith('authToken='))?.split('=')[1];

    jwt.verify(token, process.env.AUTH_TOKEN_SECRET,async (err, user) => {
        if (err) return res.sendStatus(401)
        let currentUser = await User.findOne({email: user.email}).exec()
        req.user = currentUser
        next()
    })
}

/**
 * Validation of auth token cookie
 * @param req
 * @param res
 * @param next
 */
function checkToken(req, res, next){
    const token = req.body['token']
    console.log(token)
    jwt.verify(token, process.env.AUTH_TOKEN_SECRET,async (err, user) => {
        if (err) return res.sendStatus(401)
        let currentUser = await User.findOne({email: user.email}).exec()
        res.json({email: currentUser.email}).status(200)
    })
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
                {expiresIn: '86400s'})

            //Setting cookies for JWT tokens, access token and refresh token
            res.cookie("authToken", authToken, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: true
            })

            res.json({email: user.email, 'id':user._id, 'name':user.name, 'rol':user.rol}).status(200)
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

module.exports = {login, logout, authenticateToken, checkToken}