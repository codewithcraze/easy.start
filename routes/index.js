const express = require('express');
const router = express.Router();
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const adminRoute = require('./admin.route');
const clientRoute = require('./client.route');

const routesIndex = [
    {
        path: '/auth/v1',
        route: authRoute
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path: '/admin',
        route: adminRoute
    },
    {
        path: '/client',
        route: clientRoute
    }
]


routesIndex.forEach((item) => router.use(item.path, item.route))


module.exports = router;