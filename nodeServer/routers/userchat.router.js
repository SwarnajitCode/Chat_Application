const {viewChat,registration,registrationDb,loginView,login,createRoom,viewRoom,logout,message,getMessage,protected,refresh} = require('../controllers/userchat.controller');
const router = require('express').Router()
const {checkToken,auth} = require('../token_validation');

router.get('/view',checkToken,viewChat)
router.get('/register',registration)
router.post('/register',registrationDb)
router.get('/login',loginView)
router.post('/login',login)
router.post('/createroom',createRoom)
router.get('/viewroom',checkToken,viewRoom)
router.post('/message',checkToken,message)
router.post('/getmessage',checkToken,getMessage)
router.post('/protected',auth,protected)
router.post('/refresh',refresh)
router.get('/logout',logout)

module.exports = router