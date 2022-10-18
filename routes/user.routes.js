const express = require('express');
const {
  getAllGrants,
  approveGrant,
  rejectGrant,
  getAllUsers,
  getGrantStats,
  getUserStats,
  searchUsers,
  searchGrants,
  getTotalAmountDisbursed,
} = require('../controllers/admin.controller');
const {
  createNewUser,
  loginUser,
  applyForGrant,
} = require('../controllers/user.controller');

const { validateUserToken, validateAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', createNewUser);
router.post('/login', loginUser);
router.post('/grant', validateUserToken, applyForGrant);
router.get('/grants', validateUserToken, validateAdmin, getAllGrants);
router.put(
  '/approve-grant/:id',
  validateUserToken,
  validateAdmin,
  approveGrant
);
router.put('/reject-grant/:id', validateUserToken, validateAdmin, rejectGrant);
router.get('/all', validateUserToken, validateAdmin, getAllUsers);
router.get('/grant-stats', validateUserToken, validateAdmin, getGrantStats);
router.get('/stats', validateUserToken, validateAdmin, getUserStats);
router.get('/search', validateUserToken, validateAdmin, searchUsers);
router.get('grant', validateUserToken, validateAdmin, searchGrants);
router.get(
  '/disbursed',
  validateUserToken,
  validateAdmin,
  getTotalAmountDisbursed
);
module.exports = router;
