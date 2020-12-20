const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) =>{

    error = { ...err}

    error.message = err.message;

    // log to console for dev
    console.log(err.stack, 'err name', err.name, err);


    if(err.name === 'CastError'){
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    res.status(error.statusCode || 500).json({
        succes: false,
        error: error.message || 'Surver Error'
    });
};

module.exports = errorHandler;