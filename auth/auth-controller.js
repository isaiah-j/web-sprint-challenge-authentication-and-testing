const db = require('../database/dbConfig')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


exports.login = async (req, res, next) => {
    const { username, password } = req.body


    try {
        let user = await db('users').where({ username })

        if (user.length == 0) {
            return next(new AppError("Username does not exist", 404))
        }

        user = user[0]

        // Compare passwords
        let passwordIsCorrect = await bcrypt.compare(password, user.password)

        if (!passwordIsCorrect) {
            return next(new AppError("Invalid password", 404))
        }

        const token = signToken(user.id)

        // Zero out password before sending it to client
        user.password = undefined

        res.status(200).json({
            status: 200,
            message: "Welcome back",
            token,
            payload: {
                user
            }
        })

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Unable to login user"
        })
    }
}

exports.register = async (req, res, next) => {
    let { username, password } = req.body

    try {
        password = await bcrypt.hash(password, 10)

        const newUser = {
            username,
            password
        }

        let user = await db('users').insert(newUser).returning('*')

        user = user[0]

        // Hide the password before sending it to client
        user.password = undefined

        const token = signToken(user.id)

        res.status(201).json({
            status: 201,
            token,
            payload: {
                user
            }
        })

    } catch (error) {
        res.json({
            status: 400,
            message: "Unable to register user"
        })
    }
}

function signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}