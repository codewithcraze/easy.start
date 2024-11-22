const httpStatus = require('http-status');
require('dotenv').config();
const { User } = require('../models/users');
const { TripAnalysis } = require('../models/analysis');
const mongoose = require('mongoose');
const moment = require('moment');

const clientController = {
    async getAllClients(req, res, next) {
        try {
            const data = await User.find({ role: "user" }, { country: 1, companyName: 1, companyUrl: 1, _id: 1, companyLogo: 1 });
            res.status(httpStatus.OK).json({ data, message: 'Clients retrieved successfully', success: true });
        } catch (error) {
            next(error);
        }
    },

    async cpcAnalysis(req, res, next) {
        try {
            const { TripType, Adult, Child, Infant, PreferredClass, Segments, Currency, userId } = req.body;
            const tripAnalysis = new TripAnalysis({
                TripType,
                Adult,
                Child,
                Infant,
                PreferredClass,
                Segments,
                Currency,
                userId,
            });
            await tripAnalysis.save();
            res.status(httpStatus.CREATED).json({
                data: tripAnalysis,
                message: 'Trip analysis data saved successfully',
                success: true
            });
        } catch (error) {
            next(error);
        }
    },

    async getAnalytics(req, res, next) {
        try {
            const userId = new mongoose.Types.ObjectId(req.body.userId);
            const { startDate, endDate } = req.body;
            const dateFilter = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);
            const analyticsData = await TripAnalysis.aggregate([
                {
                    $match: {
                        userId,
                        ...(startDate || endDate ? { createdAt: dateFilter } : {}) 
                    }
                },
                {
                    $group: {
                        _id: {
                            userId: "$userId",
                            tripType: "$TripType",
                            preferredClass: "$PreferredClass",
                            route: {
                                $cond: {
                                    if: { $eq: ["$TripType", "round-trip"] },
                                    then: {
                                        $concat: [
                                            { $arrayElemAt: ["$Segments.Origin", 0] }, "-",
                                            { $arrayElemAt: ["$Segments.Destination", 0] }, "-",
                                            { $arrayElemAt: ["$Segments.Origin", 0] }
                                        ]
                                    },
                                    else: {
                                        $concat: [
                                            { $arrayElemAt: ["$Segments.Origin", 0] }, "-",
                                            { $arrayElemAt: ["$Segments.Destination", 0] }
                                        ]
                                    }
                                }
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        route: "$_id.route",
                        tripType: "$_id.tripType",
                        preferredClass: "$_id.preferredClass",
                        count: 1,
                        _id: 0
                    }
                }
            ]);
            const todayStart = moment().startOf('day').toISOString();  
            const todayEnd = moment().endOf('day').toISOString();      
            const yesterdayStart = moment().subtract(1, 'day').startOf('day').toISOString();  
            const yesterdayEnd = moment().subtract(1, 'day').endOf('day').toISOString();     
            const todayClicks = await TripAnalysis.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        createdAt: { $gte: new Date(todayStart), $lte: new Date(todayEnd) }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ]);
            const yesterdayClicks = await TripAnalysis.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        createdAt: { $gte: new Date(yesterdayStart), $lte: new Date(yesterdayEnd) }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ]);
            const todayCount = todayClicks.length ? todayClicks[0].count : 0;
            const yesterdayCount = yesterdayClicks.length ? yesterdayClicks[0].count : 0;
            const percentageChange = yesterdayCount > 0 ? ((todayCount - yesterdayCount) / yesterdayCount) * 100 : 0;
            res.status(httpStatus.OK).json({
                data: analyticsData, success: true, todayClicks: todayCount,
                yesterdayClicks: yesterdayCount,
                percentageChange, message: "Analytics retrieved successfully"
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = clientController;
