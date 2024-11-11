const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');
// authentification middleware.
const upload  = require('../middleware/upload');




router.route('/verify-account').post(auth('updateAny', 'access'), adminController.allowAccess);

router.route('/upload-logo').post(auth('updateAny', 'access'), upload.single('logo') , adminController.addLogo);

module.exports = router;
