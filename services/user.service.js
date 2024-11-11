const httpStatus = require('http-status');
const { ApiError } = require('../middleware/apierror');
const { User } = require('../models/users');
const jwt = require('jsonwebtoken');

const findwithEmail = async (email) => {
    return await User.findOne({ email });
}
const findUserById = async (_id) => {
    return await User.findById(_id);
}

const updateUserProfile = async (req) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                "$set": {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    age: req.body.age
                }
            },
            { new: true }
        )
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }
        return user;
    } catch (error) {
        throw error;
    }
}

const findAndUpdateEmail = async (req) => {
    try {
        if (await User.emailTaken(req.body.newemail)) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email is Already Taken');
        }
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                "$set": {
                    email: req.body.newemail, 
                    verified: false
                }
            },
            { new: true }
        )
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        return user;
    } catch (error) {
        throw error;
    }
}

const updatePassword = async (user, password) => {
    try {
        const userInfo = await User.findById(user.sub);
        if (!userInfo) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        userInfo.password = password;
        await userInfo.save();
        return userInfo;
    } catch (error) {
        throw error;
    }
}



module.exports = { findwithEmail, findUserById, updateUserProfile, findAndUpdateEmail, updatePassword };