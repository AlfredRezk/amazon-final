const auth = require('../controllers/auth');
const { login, signup, forgetPassword, resetPassword} = require('../validation/auth');
const router = require('express').Router();


router.get('/login', auth.getLogin);
router.get('/signup', auth.getSignup);
router.post('/signup', signup(), auth.postSignup);
router.post('/login', login(), auth.postLogin);
router.get('/logout', auth.getLogout);
// Advanced Authentication 
router.get('/forgetpassword', auth.getForgetPassword);
router.post('/forgetpassword', forgetPassword(),  auth.postForgetPassword);
router.get('/resetpassword/:resetToken', auth.getResetPassword);
router.post('/resetpassword', resetPassword(),  auth.postResetPassword);

module.exports  = router;