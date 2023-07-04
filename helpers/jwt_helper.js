const JWT = require('jsonwebtoken');
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
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // reject (err);
                    reject(createError.InternalServerError())
                }
                reslove(token);
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
            if (err) {
                return next(createError.Unauthorized())
            }
            req.payload = payload
            next();
        })
    }
}