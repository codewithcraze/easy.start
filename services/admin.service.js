
const httpStatus = require('http-status');
const { ApiError } = require('../middleware/apierror');
const { User } = require('../models/users');
const crypto = require('crypto');


const genPassword = async (email) => {
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }

        const password = generateRandomPassword();
        user.password = password;
        user.verified = true;
        await user.save();

        return {user, password};

    } catch (error) {
        throw error;
    }
}

const updateLogo = async (userId, logoSvg) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        user.companyLogo = logoSvg;
        await user.save();
        return user;
    }catch(error){
        throw error;
    }
}




function generateRandomPassword(length = 20) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

module.exports = {genPassword, updateLogo };