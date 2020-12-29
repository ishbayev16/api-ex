const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) =>{

    error = { ...err}

    error.message = err.message;

    // log to console for dev
    console.log(err.stack, 'err name', err.name, err);


    if(err.name === 'CastError'){
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate key
    if(err.code == 11000){
        const message = 'Duplicate filed value entered';
        error = new ErrorResponse(message, 400);
    }

    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }


    res.status(error.statusCode || 500).json({
        succes: false,
        error: error.message || 'Surver Error'
    });
};

module.exports = errorHandler;