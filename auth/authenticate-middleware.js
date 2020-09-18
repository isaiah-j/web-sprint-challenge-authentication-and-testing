/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken')
const db = require('../database/dbConfig')

exports.protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }


  if (!token) {
    return res.json({ status: 403, message: "Please login to continue" })
  }

  try {
    let decoded = await jwt.verify(token, process.env.JWT_SECRET)

    const currentUser = await db('users').where({ id: decoded.id }).first()

    // console.log(currentUser)

    if (!currentUser) {
      return res.status(404).json({ status: 400, message: "The user belonging to this token no longer exists" })
    }

    currentUser.password = undefined

    req.user = currentUser

    return next()
  } catch (error) {
    res.json({
      status: 500,
      message: "Internal Server Error"
    })
  }
}

