const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
// const auth = require('../middleware/auth');

router.get('/get-agents', clientController.getAllClients);

router.post('/cpc', clientController.cpcAnalysis);
router.post('/get-analytics', clientController.getAnalytics);
router.post('/get-monthly-report', clientController.getMonthlyReport);

module.exports = router;
