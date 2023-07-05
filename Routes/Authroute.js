const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../helpers/jwt_helper');
const AuthController = require('../Controllers/Auth_Controller');


router.get('/get', verifyAccessToken, AuthController.get);

router.post('/register', AuthController.register)

router.post('/login', AuthController.login);

router.post('/refresh', AuthController.refresh);

router.delete('/logout', AuthController.logout)


module.exports = router;