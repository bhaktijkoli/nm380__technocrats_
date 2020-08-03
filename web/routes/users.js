const router = require('express').Router();
const controller = require('../controllers/user');
const passport = require('../auth/passport');

// Auth
router.post('/login', passport.authenticate('login', {session: false}), controller.onLogin);
router.post('/register', passport.authenticate('register', {session: false}), controller.onLogin);
router.post('/refresh', passport.authenticate('verify', {session: false}), controller.refreshSession);

// Videos
router.get('/videos/:id', /* passport.authenticate('verify'),*/ controller.getVideo);
router.get('/videos', passport.authenticate('verify', {session: false}), controller.getVideos);
router.post('/videos', passport.authenticate('verify', {session: false}), controller.uploadVideo);

module.exports = router;
