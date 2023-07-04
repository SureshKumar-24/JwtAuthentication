const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((reslove, reject) => {
            const payload = {}
            const secret = "some secret key"
            const options = {
                expiresIn: '1h',
                issuer: 'jwtauth.com',
                audience: userId
            }
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) return reject(err)
                reslove(token);
            })
        })
    }
}