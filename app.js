const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require("dotenv").config();
require('./helpers/inti_mongodb');
const app = express();
const bodyParser = require('body-parser');
const Authroute = require('./Routes/Authroute');
app.use(morgan('dev'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/Auth', Authroute);


// app.use(async (req, res, next) => {
//     const error = new Error('Not found ')
//     error.status = 404;
//     next(error);
// })

// app.use((err, req, res, next) => {
//     // res.status(err.status || 500);
//     // res.send({
//     //     error: {
//     //         status: err.status || 500,
//     //         message: err.message
//     //     }
//     // })
//     next(createError.NotFound())
// })

app.listen(3000, () => {
    console.log("App Running Successfully");
})