const User = require('../Models/User');
const createError = require('http-errors');
const { authSchema } = require('../helpers/validation_schema');
const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');

const client = require('../helpers/init_redis');
module.exports = {
    register: async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await authSchema.validateAsync(req.body);

            const doesExist = await User.findOne({ email: result.email });
            if (doesExist) throw createError.Conflict(`${result.email} is already registered`);

            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(result.email, salt);
            const user = new User({ email, password });
            const savedUser = await user.save();
            const accesstoken = await signAccessToken(savedUser.id);
            const refreshtoken = await signRefreshToken(savedUser.id);
            return res.status(200).json({ accesstoke: accesstoken, refreshtoke: refreshtoken });

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await authSchema.validateAsync(req.body);
            const Userdata = await User.findOne({ email: email });
            if (!Userdata) {
                throw createError.Conflict(`User not registered`);
            }

            const comparepassword = bcrypt.compare(password, Userdata.password);
            if (!comparepassword) {
                throw createError.Conflict(`Username/Password not valid`);
            } else {
                const accesstoken = await signAccessToken(Userdata.id);
                const refreshtoken = await signRefreshToken(Userdata.id);
                return res.status(200).json({ accesstoken: accesstoken, refreshtoken: refreshtoken });
            }
        }
        catch (error) {
            if (error.isJoi === true) return next(createError.BadRequest('Invalid Username/Password'));
            next(error);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const token = req.body.refreshToken;
            if (!token) throw createError.BadRequest();
            const userId = await verifyRefreshToken(token);
            console.log(userId);
            const accesstoken = await signAccessToken(userId);
            const refreshToken = await signRefreshToken(userId);
            return res.status(200).json({ accesstoken: accesstoken, refreshtoken: refreshToken });
        }
        catch (error) {
            next(error);
        }
    },

    logout: async (req, res, next) => {
        try {
            const token = req.body.refreshToken;
            if (!token) throw createError.BadRequest()
            const userId = await verifyRefreshToken(token)
            client.DEL(userId, (err, val) => {
                if (err) {
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
                console.log(val)
                res.sendStatus(204);
            })
        } catch (error) {
            next(error)
        }
    },

    get: async (req, res, next) => {
        res.send("hello");
    }
}