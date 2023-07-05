const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { ref } = require('joi');
require("dotenv").config();
const client = require('./init_redis');

console.log(process.env.ACCESS_TOKEN);
console.log(process.env.REFRESH_TOKEN);
module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN;
            const options = {
                expiresIn: '1h',
                issuer: 'jwtauth.com',
                audience: userId
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        });
    },

    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN;
            const options = {
                expiresIn: '1y',
                issuer: 'jwtauth.com',
                audience: userId
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(createError.InternalServerError());
                }
                client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                    if (err) {
                        console.error(err.message);
                        reject(createError.InternalServerError());
                    } else {
                        resolve(token);
                    }
                });
            });
        });
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN, (err, payload) => {
                if (err) return reject(createError.Unauthorized());

                const userId = payload.aud;
                client.GET(userId, (err, result) => {
                    if (err) {
                        console.log(err.message)
                        reject(createError.InternalServerError());
                    }
                    if (refreshToken === result) return resolve(userId)
                    reject(createError.Unauthorized());
                })
                resolve(userId);

            });
        });
    }
};
