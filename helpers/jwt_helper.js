const jwt = require('jsonwebtoken');
const createError = require('http-errors');
require("dotenv").config();
console.log(process.env.ACCESS_TOKEN);

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((reslove, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN
            const options = {
                expiresIn: '1h',
                issuer: 'jwtauth.com',
                audience: userId
            }
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // reject (err);
                    reject (createError.InternalServerError())
                }
                reslove(token);
            })
        })
    }
}