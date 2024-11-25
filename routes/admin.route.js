const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');
// authentification middleware.
const upload  = require('../middleware/upload');




router.route('/verify-account').post(auth('updateAny', 'access'), adminController.allowAccess);
router.route('/upload-logo').post(auth('updateAny', 'access'), upload.single('logo') , adminController.addLogo);
router.route('/get-partners').post(auth('updateAny', 'access'), adminController.getPartners);
router.route('/get-partner-click-count').post(auth(), adminController.getPartnerClickCount)



module.exports = router;
