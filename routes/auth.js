const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout
 /* logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  confirmEmail, */
} = require('../controllers/auth');

const router = express.Router();

const {protect } = require('../middleware/auth');

/* const { protect } = require('../middleware/auth');
 */
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', logout);

/*router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/confirmemail', confirmEmail);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword); */

module.exports = router;