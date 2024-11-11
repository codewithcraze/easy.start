const mongoose = require('mongoose');
const httpStatus = require('http-status');


class ApiError extends Error {
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
// class for handling the error;

// err --> is an instance of ApiError.

const handleError = (err, res) => {
    if (err instanceof mongoose.Error.ValidationError) {
        // Set a 400 status code for validation errors
        const statusCode = httpStatus.BAD_REQUEST;
        const message = Object.values(err.errors).map(e => e.message).join(', ');
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    } else {
        const { statusCode = httpStatus.INTERNAL_SERVER_ERROR, message = 'Internal Server Error' } = err;
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }
};



module.exports = {
    ApiError, 
    handleError
}


