const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const createError = require('http-errors');
const { authSchema } = require('../helpers/validation_schema');
const bcrypt = require('bcrypt');
const { signAccessToken } = require('../helpers/jwt_helper');

router.post('/register', async (req, res, next) => {
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
        return res.send(accesstoken);

    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    try {

    }
    catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error);
    }
})

router.post('/refresh-token', async (req, res, next) => {
    res.send('refresh token route');
})

router.delete('/logout', async (req, res, next) => {
    res.send('logout  route');
})

module.exports = router;
