const { authService, emailService } = require('../services');
const { adminService } = require('../services');
const httpStatus = require('http-status');
require('dotenv').config();


const authController = {
    async allowAccess(req, res, next) {
        try {
            const email = req.body.email;
            const {user, password} = await adminService.genPassword(email);
            await emailService.registerEmail(email, user, password);
            res.json(
                {
                    user,
                    password
                }
            )
        } catch (error) {
            next(error);
        }
    },
    async addLogo(req, res, next) {
        try{    
            const { _id } = req.body;
            const path = `${process.env.IMAGE_ACCESS}/`+ req.file.filename;
            const update = await adminService.updateLogo(_id, path);
            res.json(update);
        }catch(error){
            next(error);
        }
    },

    async getPartners(req, res, next){
        try{
            const partners = await adminService.getPartners();
            res.json(partners);
        }catch(error){
            next(error);
        }
    },
    async getPartnerClickCount(req, res, next){
        try{
            const { startDate, endDate } = req.body;
            const partnersCount = await adminService.getPartnersCount(startDate, endDate);
            res.json(partnersCount)
        }catch(error){
            next(error);
        }
    }
}





module.exports = authController;