const { authService, emailService } = require('../services');
const { userService } = require('../services');
const httpStatus = require('http-status');

const authController = {
    async register(req, res, next) {
        try {
            const { email, password } = req.body;
            const {user} = await authService.createUser(email, password);
            const token = await authService.genAuthToken(user);
            await emailService.registerEmail(email, user, password);

            res.cookie('x-access-token', token, {
                httpOnly: true,
                secure: false, // For development, set to false (true for HTTPS)
                sameSite: 'strict',
            }).status(httpStatus.CREATED).send({ user, token });
        } catch (error) {
            next(error);
        }
    },
    async signin(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await authService.signinfindEmailwithPassword(email, password);
            const token = await authService.genAuthToken(user);
            res.cookie('x-access-token', token).status(httpStatus.CREATED).send({ user, token });
        } catch (error) {
           next(error);
        }
    },
    async isauth(req, res, next) {
        try {
            res.json({ message: 'You are authenticated!', user: req.user });
        } catch (error) {
            throw error
        }
    },
    async forgetPassword(req, res, next){
        try{
            const { email } = req.body;
            const user = await authService.findUserByEmail(email);
            const token = await authService.genAuthToken(user);
            await emailService.forgetPasswordEmail(email, user, token);
            res.json({message: 'Email sent successfully', user, token});
        }catch(error){
            next(error);
        }
    },
    async resetPassword(req, res, next){
        try{
            const { token, password } = req.body;
            const user = authService.validation(token);
            const result = await userService.updatePassword(user, password);
            await emailService.resetPasswordEmail(result.email);
            res.json({message: 'Password reset successfully', result});
        }catch(error){
            next(error);
        }
    }
}

module.exports = authController;