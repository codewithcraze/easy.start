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
    },
    async getMonthlyReport(req, res, next) {
        try {
          const currentYear = new Date().getFullYear();
          const userId = req.body.userId;
      
          // Define the list of months (1 through 12 for January to December)
          const monthsArray = [
            { month: 'January', monthNumber: 1 },
            { month: 'February', monthNumber: 2 },
            { month: 'March', monthNumber: 3 },
            { month: 'April', monthNumber: 4 },
            { month: 'May', monthNumber: 5 },
            { month: 'June', monthNumber: 6 },
            { month: 'July', monthNumber: 7 },
            { month: 'August', monthNumber: 8 },
            { month: 'September', monthNumber: 9 },
            { month: 'October', monthNumber: 10 },
            { month: 'November', monthNumber: 11 },
            { month: 'December', monthNumber: 12 },
          ];
      
          const result = await TripAnalysis.aggregate([
            {
              // Match trips for the specified user and filter trips created in the current year
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
                createdAt: {
                  $gte: new Date(`${currentYear}-01-01`), // From start of the current year
                  $lt: new Date(`${currentYear + 1}-01-01`), // Till start of the next year
                },
              },
            },
            {
              // Group trips by the month and count the number of trips per month
              $group: {
                _id: { $month: '$createdAt' },
                count: { $sum: 1 },
              },
            },
            {
              // Project the result to have the month number and count
              $project: {
                _id: 0,
                monthNumber: '$_id',
                count: 1,
              },
            },
            {
              // Perform a lookup to "join" with the monthsArray
              $addFields: {
                monthsArray: monthsArray,
              },
            },
            {
              // Unwind to merge the predefined months array
              $unwind: '$monthsArray',
            },
            {
              // Match the monthNumber with predefined months or set the count to 0
              $project: {
                month: '$monthsArray.month',
                monthNumber: '$monthsArray.monthNumber',
                count: {
                  $cond: {
                    if: { $eq: ['$monthsArray.monthNumber', '$monthNumber'] },
                    then: '$count',
                    else: 0,
                  },
                },
              },
            },
            {
              // Group back by month to ensure all months are present
              $group: {
                _id: { month: '$month', monthNumber: '$monthNumber' },
                count: { $max: '$count' }, // Take the maximum count (which will either be a valid count or 0)
              },
            },
            {
              // Sort by monthNumber (to ensure correct sequence)
              $sort: { '_id.monthNumber': 1 },
            },
            {
              // Project final result to have a clean structure
              $project: {
                _id: 0,
                month: '$_id.month',
                count: 1,
              },
            },
          ]);
      
          res.json({ success: true, data: result });
          
        } catch (err) {
          console.error(err);
          throw new Error('Error while fetching monthly click data');
        }
      }
      
      
};

module.exports = clientController;
