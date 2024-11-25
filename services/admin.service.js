
const httpStatus = require('http-status');
const { ApiError } = require('../middleware/apierror');
const { User } = require('../models/users');
const crypto = require('crypto');
const { TripAnalysis } = require('../models/analysis');
const moment = require('moment');

const genPassword = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }

        const password = generateRandomPassword();
        user.password = password;
        user.verified = true;
        await user.save();

        return { user, password };

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
    } catch (error) {
        throw error;
    }
}

const getPartners = async () => {
    try {
        const users = await User.find({ role: 'user', verified: false });
        return users;
    } catch (error) {
        throw error;
    }
}

const getPartnersCount = async (startDate, endDate) => {
    try {

        // Define date filters for matching trips within the date range
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        // Step 1: Aggregate route analytics for all verified users
        const analyticsData = await TripAnalysis.aggregate([
            {
                // Lookup to join the User collection
                $lookup: {
                    from: 'users', // The User collection name
                    localField: 'userId', // Field in TripAnalysis
                    foreignField: '_id', // Field in User
                    as: 'userInfo', // Output field to hold user data
                },
            },
            {
                // Unwind to flatten the userInfo array
                $unwind: '$userInfo',
            },
            {
                // Match only trips for verified users
                $match: {
                    'userInfo.verified': true,
                    ...(startDate || endDate ? { createdAt: dateFilter } : {}),
                },
            },
            {
                // Group trips by userId, tripType, preferredClass, and route (Origin-Destination)
                $group: {
                    _id: {
                        userId: '$userId',
                        tripType: '$TripType',
                        preferredClass: '$PreferredClass',
                        route: {
                            $cond: {
                                if: { $eq: ['$TripType', 'round-trip'] },
                                then: {
                                    $concat: [
                                        { $arrayElemAt: ['$Segments.Origin', 0] }, '-',
                                        { $arrayElemAt: ['$Segments.Destination', 0] }, '-',
                                        { $arrayElemAt: ['$Segments.Origin', 0] },
                                    ],
                                },
                                else: {
                                    $concat: [
                                        { $arrayElemAt: ['$Segments.Origin', 0] }, '-',
                                        { $arrayElemAt: ['$Segments.Destination', 0] },
                                    ],
                                },
                            },
                        },
                    },
                    count: { $sum: 1 }, // Count trips per route
                },
            },
            {
                // Project the route analytics
                $project: {
                    userId: '$_id.userId',
                    route: '$_id.route',
                    tripType: '$_id.tripType',
                    preferredClass: '$_id.preferredClass',
                    count: 1, // Keep the trip count
                },
            },
            {
                // Group everything by userId and collect their route analytics
                $group: {
                    _id: '$userId',
                    routes: {
                        $push: {
                            route: '$route',
                            tripType: '$tripType',
                            preferredClass: '$preferredClass',
                            clicks: '$count',
                        },
                    },
                    totalClicks: { $sum: '$count' }, // Sum of clicks per user
                },
            },
            {
                // Lookup again to retrieve user details for each userId
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            {
                // Unwind to flatten the userInfo array
                $unwind: '$userInfo',
            },
            {
                // Project the final output with user info and route analytics
                $project: {
                    _id: 0,
                    userId: '$_id',
                    firstname: '$userInfo.firstname',
                    lastname: '$userInfo.lastname',
                    email: '$userInfo.email',
                    companyName: '$userInfo.companyName',
                    routes: 1, // Include route analytics
                    totalClicks: 1, // Include the total click count
                },
            },
        ]);

        // Step 2: Calculate today's and yesterday's click analytics
        const todayStart = moment().startOf('day').toISOString();
        const todayEnd = moment().endOf('day').toISOString();
        const yesterdayStart = moment().subtract(1, 'day').startOf('day').toISOString();
        const yesterdayEnd = moment().subtract(1, 'day').endOf('day').toISOString();

        const todayClicks = await TripAnalysis.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(todayStart), $lte: new Date(todayEnd) },
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);
        const yesterdayClicks = await TripAnalysis.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(yesterdayStart), $lte: new Date(yesterdayEnd) },
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);

        // Calculate click counts and percentage change
        const todayCount = todayClicks.length ? todayClicks[0].count : 0;
        const yesterdayCount = yesterdayClicks.length ? yesterdayClicks[0].count : 0;
        const percentageChange =
            yesterdayCount > 0 ? ((todayCount - yesterdayCount) / yesterdayCount) * 100 : 0;

        // Step 3: Send the final response
        return {
            success: true,
            data: analyticsData, // Route analytics for each verified user
            todayClicks: todayCount,
            yesterdayClicks: yesterdayCount,
            percentageChange,
            message: 'Analytics retrieved successfully',
        };
    } catch (error) {
        throw error;
    }
};



function generateRandomPassword(length = 20) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

module.exports = { genPassword, updateLogo, getPartners, getPartnersCount };