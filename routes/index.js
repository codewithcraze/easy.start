const express = require('express');
const router = express.Router();
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const adminRoute = require('./admin.route');
const setupRoute = require('./setup.route');

const routesIndex = [
    {
        path: 'api/auth/v1',
        route: authRoute
    },
    {
        path: 'api/users',
        route: userRoute
    },
    {
        path: 'api/admin',
        route: adminRoute
    },
    {
        path: '/',
        route: setupRoute
    }
]


routesIndex.forEach((item) => router.use(item.path, item.route))


module.exports = router;