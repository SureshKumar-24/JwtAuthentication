const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const createError = require('http-errors');
const { authSchema } = require('../helpers/validation_schema');

router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authSchema.validateAsync(req.body);
        console.log(result);
        if (!email || !password) {
            return res.status(401).json({ msg: "Something wrong " })
        }

        const doesExist = await User.findOne({ email: email });
        if (doesExist) {
            return res.status(403).json({ msg: "email is already registerd" })
        }

        const user = new User({ email, password });
        const savedUser = await user.save();

        return res.send(savedUser);
    } catch (error) {
        next(error);
    }
    // res.send('register route');
})

router.post('/login', async (req, res, next) => {
    res.send('register route');
})

router.post('/refresh-token', async (req, res, next) => {
    res.send('refresh token route');
})

router.delete('/logout', async (req, res, next) => {
    res.send('logout  route');
})

module.exports = router;
