const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const app = express();
require("dotenv").config();
require('./helpers/inti_mongodb');
require('./helpers/init_redis');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Authroute = require('./Routes/Authroute');
app.use(morgan('dev'));

app.use('/Auth', Authroute);

app.listen(3000, () => {
    console.log("App Running Successfully");
})