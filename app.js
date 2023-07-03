const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config;
const app = express();

app.get('/', (req, res) => {
    res.send("hello");
})

app.use(async (req, res, next) => {
    const error = new Error('Not found ')
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    // res.status(err.status || 500);
    // res.send({
    //     error: {
    //         status: err.status || 500,
    //         message: err.message
    //     }
    // })
    next (createError.NotFound())
})

const PORT = process.env.PORT;
console.log(PORT);
app.listen(3000, () => {
    console.log("App Running Successfully");
})