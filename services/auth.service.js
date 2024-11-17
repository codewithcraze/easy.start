const  userService  = require('./user.service');
const { User } = require('../models/users');
const { ApiError } = require('../middleware/apierror');
const crypto = require('crypto');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const createUser = async (email, password) => {
    try{
        if(await User.emailTaken(email)){
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email is Already Taken');
        }

        const user = new User({
            email,
            password,
        })
        await user.save();
        return {user};
    }catch(error){
        throw error;
    }
}

const genAuthToken = (user) => {
    const Token = user.generateAuthToken();
    return Token;
}

const signinfindEmailwithPassword = async (email, password) => {
    try{
        const user = await userService.findwithEmail(email);
        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST,'Email is not Exists');
        }
        if (!(await user.comparePassword(password))) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong User Password');
        }
        return user;
    }catch(error){
        throw error
    }
}

const findUserByEmail = async (email) => {
    try{
        const user = await userService.findwithEmail(email);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
        }
        return user;
    }catch(error){
        throw error
    }
}
function generateRandomPassword(length = 20) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}
  
function validation (token) {
    const tok = jwt.verify(token, process.env.DB_SECRET);
    return tok;
}


module.exports = {
    createUser,
    genAuthToken,
    findUserByEmail,
    signinfindEmailwithPassword,
    validation
}


